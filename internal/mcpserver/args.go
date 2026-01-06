package mcpserver

import (
	"encoding/json"
)

func optionalString(args map[string]any, key string) (string, bool) {
	value, ok := args[key]
	if !ok || value == nil {
		return "", false
	}
	str, ok := value.(string)
	return str, ok
}

func optionalBool(args map[string]any, key string) (*bool, bool) {
	value, ok := args[key]
	if !ok || value == nil {
		return nil, false
	}
	boolean, ok := value.(bool)
	if !ok {
		return nil, false
	}
	return &boolean, true
}

func optionalBoolValue(args map[string]any, key string) bool {
	value, ok := optionalBool(args, key)
	if !ok || value == nil {
		return false
	}
	return *value
}

func optionalInt(args map[string]any, key string) (int, bool) {
	value, ok := args[key]
	if !ok || value == nil {
		return 0, false
	}
	switch number := value.(type) {
	case int:
		return number, true
	case int64:
		return int(number), true
	case float64:
		return int(number), true
	case json.Number:
		parsed, err := number.Int64()
		if err != nil {
			return 0, false
		}
		return int(parsed), true
	default:
		return 0, false
	}
}

func optionalInt64(args map[string]any, key string) (*int64, bool) {
	value, ok := args[key]
	if !ok || value == nil {
		return nil, false
	}
	switch number := value.(type) {
	case int:
		converted := int64(number)
		return &converted, true
	case int64:
		return &number, true
	case float64:
		converted := int64(number)
		return &converted, true
	case json.Number:
		parsed, err := number.Int64()
		if err != nil {
			return nil, false
		}
		return &parsed, true
	default:
		return nil, false
	}
}
