---
title: Win32 Window
URLslug: projects/project2
date: 20/12/2023
---

# Win32 Window


## CMake
While it may seem unitiutive to use CMake for a DirectX12 application given that it is exclusive to Windows. It becomes useful if I want to expand the project to other OS by supporting other Graphics API.

we make it a win32 application by...  
### Run the Cmake

We need to use the Visual studio CMakePreset.json depending on how we want `BASH• cmake --build --preset <build directory>` alternatively we can just use Visual Studio.   

### Unicode
We can set whether to use ASNI or wide strings. This will determine whether RegisterClassExA or RegisterClassExW is used by setting the UNICODE is defined.
## Debugging
Given that it is no longer a console application we can't output debug information to console instead..  

### Exit the window 

GetMessage(&windowMsg, NULL, 0, 0); given that WM_QUIT is a thread message we have to specify NULL rather than the window handle. 


## Run the Cmake

We need to use the Visual studio CMakePreset.json depending on how we want `BASH• cmake --build --preset <build directory>` alternatively we can just use Visual Studio.   

Depending on the generator used to build the 


```c++ {numberLines}
#include <iostream>
int main{
    std::cout<<"Hello, World.";
}
```

```cmake {numberLines}
cmake_minimum_required (VERSION 3.8)

project ("Window")
set(CMAKE_CXX_STANDARD 17) #Use C++17
add_executable (Window WIN32 "Window.cpp") #Make a Windows GUI application

option(USE_UNICODE "Support Unicode." ON)
if(USE_UNICODE)
	target_compile_definitions(Window PUBLIC UNICODE) #When Windows.h is linked it will get the compile defintion
endif()
```

Fin



