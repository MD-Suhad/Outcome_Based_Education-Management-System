package com.shohaib.core.api;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.stereotype.Component;

@Component
public class Sanitizer
{

    /**
     * @param unsafeString - String that is unsafe and needs to be sanitized
     * @return Safe string with Whitelist.relaxed()
     */
    public String sanitize(String unsafeString)
    {
        Safelist Whitelist = null;
        return Jsoup.clean(unsafeString, Whitelist.relaxed());
    }
}
