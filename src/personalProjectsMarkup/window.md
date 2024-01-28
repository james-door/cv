---
title: Win32 Window
URLslug: projects/project2
date: 21/1/2023
---

# Project: Win32 Window
I have used CMake with console applications before but not with GUI applications.

## CMake
This is a simple CMake project so I only have a single `cmake•CMakeLists.txt` file which is in the below code fence. The file consists of the usual CMake setup except I specify the `cmake•WIN32` property when calling the `cmake•add_executable` command. This makes `cmake•Window`a GUI executable instead of a console application. 
```cmake {numberLines, filePath:{path:'Win32-Window/CMakeLists.txt', link:'https://github.com/james-door/Win32-Window/blob/master/CMakeLists.txt'}}
cmake_minimum_required(VERSION 3.8)

project ("Window")
set(CMAKE_CXX_STANDARD 17)
add_executable(Window WIN32 "Window.cpp")

option(USE_UNICODE "Support Unicode." ON)
if(USE_UNICODE)
    target_compile_definitions(Window PUBLIC UNICODE)
    target_compile_definitions(Window public _UNICODE)
endif()
```
Additionally I create a CMake Option `cmake•USE_UNICODE`. When `cmake•USE_UNICODE` is `cmake•ON` we set two compiler definitions `cmake•UNICODE` and `cmake•_UNICODE`. These compiler definitions will set both the Windows API and C runtime respectively to map functions to their wide-character versions. When `cmake•USE_UNICODE` is `cmake•OFF` then the functions will be mapped to narrow character versions. I use the `cmake•PUBLIC` specifier when adding the compile definition to the executable, ensuring that it is applied when linking with the Windows API and C runtime.

### Running the Cmake
We need to use the Visual studio CMakePreset.json depending on how we want `BASH• cmake --build --preset <build directory>` alternatively we can just use Visual Studio.   

Depending on the generator used to build the 


## Creating The Window
To create the window I use the Win32 API. In the CMake I don't explictly link any files Win32 library files. Most C++ compilers that support Windows, including Clang++, MSVC, and GCC (when used for Windows development), are configured to automatically link against these standard Windows libraries.

### Debugging
Given that it is no longer a console application we can't output debug information to console instead..  




in the CMake project given that they are autoatmically linked with all complient C++ compilers.


### Exit the window 

GetMessage(&windowMsg, NULL, 0, 0); given that WM_QUIT is a thread message we have to specify NULL rather than the window handle. 



