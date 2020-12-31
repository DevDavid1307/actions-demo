package main

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestAdd(t *testing.T) {
	a := 1
	b := 1

	expected := a + b

	result := Add(a, b)

	assert.Equal(t, expected, result)
}

func TestDemo(t *testing.T) {
	a := 1
	b := 1

	expected := a / b

	result, _ := Demo(a, b)

	assert.Equal(t, expected, result)
}

func TestDemo2(t *testing.T) {
	_, err := Demo(1, 0)

	assert.Error(t, err, errors.New("bad params"))
}
