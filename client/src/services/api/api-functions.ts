import axiosInstance from "./axios-instance"
import qs from "qs"

export const getMobileScore = async(url: string)=>{
    const params = {
        url: url,
        strategy: "mobile",
        category: ['performance', 'seo'],
        locale: 'en',
    }
    return axiosInstance.get("", {params, paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: 'repeat' }), 
      })
}

export const getDesktopScore = async(url: string)=>{
    const params = {
        url: url,
        strategy: "desktop",
        category: ['performance', 'seo'],
        locale: 'en',
    }
    return axiosInstance.get("", {params, paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: 'repeat' }), 
      })
}

export const getSEOScore = async(url: string)=>{
    const params = {
        url: url,
        category: ['SEO'],
        locale: 'en',
    }
    return axiosInstance.get("", {params, paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: 'repeat' }),
      })
}