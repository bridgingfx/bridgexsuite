<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait CamelCaseAttributes
{
    public function toArray()
    {
        $array = parent::toArray();
        $camelArray = [];
        foreach ($array as $key => $value) {
            $camelKey = Str::camel($key);
            if (is_array($value)) {
                $camelArray[$camelKey] = $this->convertKeysToCamel($value);
            } else {
                $camelArray[$camelKey] = $value;
            }
        }
        return $camelArray;
    }

    protected function convertKeysToCamel(array $array): array
    {
        $result = [];
        foreach ($array as $key => $value) {
            $camelKey = is_string($key) ? Str::camel($key) : $key;
            if (is_array($value)) {
                $result[$camelKey] = $this->convertKeysToCamel($value);
            } else {
                $result[$camelKey] = $value;
            }
        }
        return $result;
    }
}
