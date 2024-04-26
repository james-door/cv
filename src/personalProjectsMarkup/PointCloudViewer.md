---
title: DirectX 12 Point Cloud Viewer
URLslug: projects/pointCloudViewer
date: 28/3/2024
---
# Point Cloud Viewer
## Overview
This is simple project in C++ that takes an ASCII point cloud as input and uses a number of DirectX12 APIs to render a visulisation of the point cloud to a [Win32 Window](https://james-door.github.io/cv/projects/window/) in real-time. The viewer doesn't have a graphical user interface, and is instead takes a single command-line argument which is the path of the ASCII point cloud to view. The below video is a rendering of a point cloud of the statue of the [Water-Moon Guanyin](https://sketchfab.com/3d-models/12th-c-ce-water-moon-guanyin-point-cloud-996ce4d6401445ac9c26f927770df851) using the viewer created by this project. The project can be built from the [Github repository](https://github.com/james-door/DX12-PCV) or, a pre-compiled binary can be downloaded using [GitHub Releases](https://github.com/james-door/DX12-PCV/releases/tag/shareBinary).

<video src="pcv.mp4"></video>
The developed viewer initially loads a point cloud in ASCII format from the computer's storage into the main memory of the CPU, also commonly referred to as the system RAM or SysRAM. Each point in the ASCII point clouds is then converted into a vertex, which is a particular arrangement of the data that the GPU can understand. This vertex, `C++•PointCloudVertex`, holds both the position of the point and the colour as 32-bit floating point vectors of type `C++•DirectX::XMFLOAT3`. This project chose to coalesce colour and position information, given that the vertex shader always accesses them together.
```C++ {numberLines:19, filePath:{path: 'DX12-PCV/PointCloudRenderer.h',link:'https://github.com/james-door/DX12-PCV/blob/main/PointCloudRenderer.h'}}
struct PointCloudVertex {
	DirectX::XMFLOAT3 modelPos;
	DirectX::XMFLOAT3 colour;
	PointCloudVertex(const DirectX::XMFLOAT3& pos, const DirectX::XMFLOAT3& col)
		: modelPos(pos), colour(col) {}
};
```
The vertex information is then read from SysRAM to GPU-visible memory, which is either GPU-visible SysRAM or Video RAM (VRAM) depending on the device. Where VRAM refers to the physical RAM chips on the board that are reserved for the GPU. Each frame the vertex data is retrieved, the GPU uses it to draw individual points on the screen. Each of these points corresponds to a vertex in the point cloud, allowing the point cloud to be visualised.


## Disk to SysRAM
The viewer only supports reading a single ASCII point cloud, the specified command-line argument representing the path of the point cloud is passed directly to the function `C++•readPointCloudASC`. The ASCII data is read from disk into a number of chunks on the heap. These ASCII chunks are then converted into `C++•PointCloudVertex` objects, as previously mentioned. 
  
Processing these chunks proved to be a bottleneck. The largest point cloud I tested, which is shown in the video above, comprised approximately 6 million points. Since it was a relatively small point cloud stored on an SSD, I found there was no I/O bottleneck. However, for larger point clouds I believe this could have been a consideration. To address the CPU-bound bottleneck I processed the chunks in parallel. Initially the number of threads, `C++•nThreads` I initially set the number of threads, `C++•nThreads`, to `C++•std::thread::hardware_concurrency`, however, I found that the overhead associated with this many  threads was greater than the performance gained for these small point clouds. On the small point clouds I found that using 4 threads gave the best performance.

The program reads in the chunks sequentially. The size of the chunks, `C++•chunkSize` is determined by `C++•size / nThreads`. In the point clouds I was viewing, each point was separated by a new-line. In each point there are three floats representing the position, followed by three 8-bit integers representing the colour (assumedly in sRGB). Finally followed by three floats representing the normals. The number of characters, or bytes, per line is unknown, which prevented being able to carefully place the start and end of chunks to avoid cutting off points. Instead, I just read the chunks and if it cuts of a point midway append it to start of the next chunk. If the size of the ASCII point cloud is not divisible by `C++•chunkSize`, the remainder is added onto the last chunk.

```C++ {numberLines:173, filePath:{path: 'DX12-PCV/PointCloudViewer.cpp',link:'https://github.com/james-door/DX12-PCV/blob/main/PointCloudViewer.cpp'}}
std::unique_ptr<std::vector<PointCloudVertex>> readPointCloudASC(std::string path)
{
    std::filesystem::path objPath = path;
    if(!std::filesystem::exists(objPath))
        return nullptr;
    std::filesystem::path filePath(objPath);

    auto size = std::filesystem::file_size(objPath);
    std::ifstream in(filePath, std::ios::binary);
    unsigned int nThreads = std::min(4U, std::thread::hardware_concurrency());
    if (nThreads < 0)
        nThreads = 1;

    std::vector<std::vector<PointCloudVertex>> threadVertices(nThreads);

    unsigned int chunkSize = size / nThreads;
    unsigned int remainder = size % nThreads;

    std::vector<std::string>chunks(nThreads);
    int endOfLineIndex = 0;

    for (int i = 0; i < nThreads; ++i)
    {
        chunks[i].resize(chunkSize + (i == (nThreads - 1) ? remainder : 0));
        in.read(chunks[i].data(), chunkSize + (i == (nThreads - 1) ? remainder : 0));

        if (i > 0 || endOfLineIndex >= chunks[0].length())
        {
            chunks[i] = chunks[i - 1].substr(endOfLineIndex, chunks[i - 1].length() - endOfLineIndex) + chunks[i];
            chunks[i - 1] = chunks[i - 1].substr(0, endOfLineIndex);
        }

        endOfLineIndex = chunks[i].rfind('\n');
        endOfLineIndex = (endOfLineIndex == std::string::npos) ? 0 : endOfLineIndex + 1;
    }
```
Each chunk in `C++•chunks` is then processed in parallel using the function `C++•processPointCloudChunkASC`. This function reads the position, color, and normal information for each point. It stores the position information and the normalised color information, while discarding the normal information. The function approximates how much space to reserve for each point based on the average number of bytes observed per line in the formats being loaded. However, for ASCII formats with different levels of precision in floating-point numbers, this estimate will be off. Instead, this should could be an approximate average that is adjusted as more of the file is read.

```C++ {numberLines:156, filePath:{path: 'DX12-PCV/PointCloudViewer.cpp',link:'https://github.com/james-door/DX12-PCV/blob/main/PointCloudViewer.cpp'}}
void processPointCloudChunkASC(const std::string &chunk, std::vector<PointCloudVertex>&verts)
{
    verts.reserve(chunk.size()/64); //approximate number of verts

    float x, y, z;
    int r, g, b;
    float nx, ny, nz;
    std::istringstream in(chunk);

    while (in >> x >> y >> z >> r >> g >> b >> nx >> ny >> nz) {
        verts.emplace_back(
            DirectX::XMFLOAT3(x, y, z),
            DirectX::XMFLOAT3(r / 255.0f, g / 255.0f, b / 255.0f)
        );
    }
}
```
## SysRAM to VRAM
The exact process of transferring data from SysRAM to a location accessible by the GPU varies depending on whether the device employs a Unified Memory Architecture (UMA) or a Non-Unified Memory Architecture (NUMA). A UMA device is one in which both the CPU and GPU share the same RAM, which is typically the case when the GPU is integrated on the same die as the CPU. In contrast, a NUMA device is one in which the CPU and GPU each have their own separate RAM.

While physically a NUMA PC has only two types of memory, the previously mentioned SysRAM and VRAM, logically, there are generally three main types.   To upload the point cloud vertices to the GPU, there are two logical types we need to consider. In Direct3D12, these are called the default and upload heaps. The default heap, `C++•D3D12_HEAP_TYPE_DEFAULT`, has direct and fast access to the GPU and no direct access to the CPU. The upload heap, `C++•D3D12_HEAP_TYPE_UPLOAD`, has direct access to the CPU and is GPU-visible, that is, it can be read directly or be transferred directly to the GPU. 

On a NUMA device, the code below queues up commands to allocate just enough memory in GPU-visible SysRAM and in VRAM to fit the point cloud vertices. The helper function `C++•UpdateSubresources` queues commands to copy the vertices into the GPU-visible SysRAM and then for the memory to be transferred into the allocated VRAM. In a NUMA device, the GPU reads from SysRAM using a PCI Express bus. PCI Express 3.0, a common interface, offers bandwidths up to approximately 16 GB/s. This means that for small point clouds, the process is very quick. The code then submits the commands to the GPU and waits for them to execute. That is, it flushes the GPU.

```C++ {numberLines:82, filePath:{path: 'DX12-PCV/PointCloudRenderer.cpp',link:'https://github.com/james-door/DX12-PCV/blob/main/PointCloudRenderer.cpp'}}
    ComPtr<ID3D12Resource> vertexStagingBufferResource;
    D3D12_RESOURCE_DESC vertexResourceDesc = CD3DX12_RESOURCE_DESC::Buffer(bufferSize);

    HANDLE_RETURN(device->CreateCommittedResource(&CD3DX12_HEAP_PROPERTIES(D3D12_HEAP_TYPE_DEFAULT), D3D12_HEAP_FLAG_NONE,
        &vertexResourceDesc, D3D12_RESOURCE_STATE_COPY_DEST, nullptr, IID_PPV_ARGS(&vertexResource)));

    HANDLE_RETURN(device->CreateCommittedResource(&CD3DX12_HEAP_PROPERTIES(D3D12_HEAP_TYPE_UPLOAD), D3D12_HEAP_FLAG_NONE,
        &vertexResourceDesc, D3D12_RESOURCE_STATE_GENERIC_READ, nullptr, IID_PPV_ARGS(&vertexStagingBufferResource)));

    cmdList->Reset(allocators[activeBuffer].Get(), nullptr);
    UpdateSubresources(cmdList.Get(), vertexResource.Get(), vertexStagingBufferResource.Get(), 0, 0, 1, &vertexSubResourceData);
    cmdList->Close();


    //Execute Command queue
    ID3D12CommandList* lists[] = { cmdList.Get() };
    cmdQueue->ExecuteCommandLists(1, lists);
    flushGPU();
```


## Minimally Enclosing Sphere
As I will discuss more in the section below [The Camera](#The%20Camera) one method for the user to be able to "orbit" the cloud using their cursor is to define a minimally enclosing sphere. Where a minimally enclosing sphere is a sphere with minimum radius that still holds each point in the cloud in its volume. This sphere, `C++•ViewingSphere`, is described in the below struct, it has a `C++•centre` and a `C++•radius`.
```C++ {numberLines:70, filePath:{path: 'DX12-PCV/PointCloudRenderer.h',link:'https://github.com/james-door/DX12-PCV/blob/main/PointCloudRenderer.h'}}
struct ViewingSphere
{
    DirectX::XMFLOAT3 centre;
    float radius;
};
```
The centre of the minimally enclosing sphere is the given by the centroid of the point cloud, which is calculted in the below function. The radius is then the maximum distance between each point in the cloud and the centroid.

```C++ {numberLines:440, filePath:{path: 'DX12-PCV/PointCloudRenderer.cpp',link:'https://github.com/james-door/DX12-PCV/blob/main/PointCloudRenderer.cpp'}}
void PointCloudRenderer::CalculateMinimumBoundingSphere(const std::vector<PointCloudVertex>& vertices) {
    //Caclulate centroid
    XMVECTOR sumPos = XMVectorSet(0.0f, 0.0f, 0.0f, 0.0f);

    for (const auto& vert : vertices) {
        XMVECTOR pos = XMLoadFloat3(&vert.modelPos);
        sumPos = XMVectorAdd(sumPos, pos);
    }

    sumPos = XMVectorScale(sumPos, 1.0f / vertices.size());

    XMFLOAT3 centre;
    XMStoreFloat3(&centre, sumPos);
    XMVECTOR centroidVec = XMLoadFloat3(&centre);

    //Calcualte radius 
    float maxDistance = 0.0f;
    for (const auto& vert : vertices) {
        XMVECTOR pos = XMLoadFloat3(&vert.modelPos);
        XMVECTOR distance = XMVector3Length(XMVectorSubtract(pos, centroidVec));
        float distanceValue;
        XMStoreFloat(&distanceValue, distance);
        maxDistance = std::max(maxDistance, distanceValue);

    }

    viewingSphere = { centre,maxDistance };
}
```

## The Camera
In the previous section a minimally enclosing sphere was calculated, one method to allow the user to orbit the point cloud is to imagine moving a camera along the surface of this sphere. In this method, the camera rotates as it moves along the surface to always look at the centre of the sphere.

On a high level, the view matrix, `C++•viewMatrix`, describes the position and orientation of a virtual camera in 3D space. The DirectXMath API provides a function `C++•XMMatrixLookAtLH` which will generate a view matrix. All it requires is the position of this virtual camera and the point the camera is looking at, and some general up direction that is not colinear with vector defined by the points `C++•cameraPos` and `C++•target`. 

Spherical coordinates can be used to describe a position in three-dimensional space. A spherical coordinate consists of a distance from the origin, $\rho$, and two angles, the azimuth, $\phi$, and the polar angle, $\theta$. If we hold $\rho$ to be constant, then varying $\phi$ and $\theta$ allows us to describe any point on the surface of a sphere with radius $\rho$.These two degrees of freedom can be conveniently controlled using the horizontal and vertical movements of the mouse, respectively.
$$
x = \rho \sin(\theta) \cos(\phi) \\
y = \rho \sin(\theta) \sin(\phi) \\
z = \rho \cos(\theta) \\
$$
Where $\rho \geq0$, $0\leq\theta\leq\pi$, and $0\leq\phi\leq2\pi$.
We can modify this more traditional formulation of spherical coordinates to be more useful in world space, where the $y$-axis is up, and $z$ is into screen. To allow camera rotation around the $y$-axis without restricting movement to one direction when $\phi=0\degree$ we can adjust the bounds of $\phi$. Similarly for rotation around the $x$-axis in both directions when $\theta=0\degree$ we adjust the bounds of $\theta$.  Also, by convention, I chose the general up vector, `C++•up` to be $[0,1,0]^T$. This will be colinear with the vector described by `C++•cameraPos` and `C++•target` when the user is looking straight up, or straight down. To avoid this, I limited the range of $\theta$ so that it is less than $\pi$.
$$
x = \rho \sin(\theta) \cos(\phi) \\
y = \rho \cos(\theta) \\
z = \rho \sin(\theta) \sin(\phi) \\
$$
Where $\rho \geq0$, $-\frac{\pi}{2}\leq\theta\lt\frac{\pi}{2}$, and $-\pi\leq\phi\leq\pi$.

```C++ {numberLines:421, filePath:{path: 'DX12-PCV/PointCloudRenderer.cpp',link:'https://github.com/james-door/DX12-PCV/blob/main/PointCloudRenderer.cpp'}}
float radius = viewingSphere.radius * 2.0f;
float theta = XMConvertToRadians(pitch + 90);
float phi = XMConvertToRadians(yaw); 
float x = radius * XMScalarSin(theta) * XMScalarCos(phi);
float z = radius * XMScalarSin(theta) * XMScalarSin(phi);
float y = radius * XMScalarCos(theta);
XMVECTOR cameraPos = XMVectorSet(viewingSphere.centroid.x + x, viewingSphere.centroid.y + y, viewingSphere.centroid.z + z, 1.0f);
XMVECTOR target = XMVectorSet(viewingSphere.centroid.x, viewingSphere.centroid.y, viewingSphere.centroid.z, 1.0f);
XMVECTOR up = XMVectorSet(0.0f, 1.0f, 0.0f, 1.0f);
viewMatrix = XMMatrixLookAtLH(cameraPos, target, up);
```
