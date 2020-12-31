package main

import (
    "github.com/stretchr/testify/assert"
    "testing"
)

func TestAdd(t *testing.T) {
    a := 1
    b := 1

    expected := a+b

    result := Add(a, b)

    assert.Equal(t, expected, result)
}

func TestDemo(t *testing.T) {
    a:=1
    b:=1


    expected := a/b

    result := Demo(a, b)

    assert.Equal(t, expected, result)
}
