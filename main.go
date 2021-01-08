package main

import (
	"errors"
	"fmt"
)

func Add(a, b int) int {
	return a + b
}

func Demo(a, b int) (int, error) {
	if b == 0 {
		return 0, errors.New("bad params")
	}

	return a / b, nil
}

func Haha() {
	fmt.Println(123)
}

func AA() {
	fmt.Println(111)
}

func BB() {
	fmt.Println(222)
}
