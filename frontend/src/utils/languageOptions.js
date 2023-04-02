export const languageOptions = [
    {

        id: 54,
        name: "C++",
        id: "cpp",
        langName: "text/x-csrc",
        fileName: "main.cpp",
        boilerPlate: `#include <iostream>

int main() {
            
    // Program code here
            
    std::cout << "Hello world!";
            
    return 0;
            
}`

    },
    {
        id: 62,
        name: "Java",
        id: 'java',
        langName: "text/x-java",
        fileName: "Main.java",
        boilerPlate: `// Your First Program

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!"); 
    }
}`

    },
    {
        id: 71,
        name: "Python",
        id: 'py',
        fileName: "script.py",
        langName: "text/x-python",
        boilerPlate: `print("Hello World!")`

    },
    {
        id: 63,
        name: "JavaScript",
        fileName: "script.js",
        id: 'js',
        langName: "text/javascript",
        boilerPlate: `console.log("Hello World!");`

    },
    {
        id: 50,
        name: "C",
        id: 'c',
        fileName: "main.c",
        langName: "text/x-csrc",
        boilerPlate: `#include <stdio.h>

int main(void) {
    printf("Hello World");
    return 0;
}`
    },
    {
        id: 51,
        name: "C#",
        id: 'cs',
        fileName: "Main.cs",
        langName: "text/x-csharp",
        boilerPlate: `// Hello World! program
namespace HelloWorld
{
    class Hello {         
        static void Main(string[] args)
        {
            System.Console.WriteLine("Hello World!");
        }
    }
}`
    },
    {
        id: 60,
        name: "Go",
        id: 'go',
        fileName: "main.go",
        langName: "text/x-go",
        boilerPlate: `package main

import "fmt"
            
func main() {
    fmt.Println("Hello, World")
}`

    },

];
