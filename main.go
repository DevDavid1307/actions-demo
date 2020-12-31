package main

import "errors"

func Add(a, b int) int {
	return a + b
}

func Demo(a, b int) (int, error) {
	if b == 0 {
		return 0, errors.New("bad params")
	}

	return a / b, nil
}
