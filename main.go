package main

func Add(a, b int) int {
   return a+b
}

func Demo(a, b int)  int{
    if b == 0 {
        panic("errors")
    }

    return a/b
}
