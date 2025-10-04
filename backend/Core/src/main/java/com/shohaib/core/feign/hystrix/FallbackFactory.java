package com.shohaib.core.feign.hystrix;

import com.shohaib.core.feign.AuthServiceFeignClient;

public interface FallbackFactory<T> {
    AuthServiceFeignClient create(Throwable throwable);
}
