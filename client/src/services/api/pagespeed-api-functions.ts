import axios from "axios";
import qs from "qs"

const BASE_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed/';
const API_KEY = import.meta.env.VITE_API_KEY;


export const getMobileScore = async(url: string)=>{
    const params = {
        key: API_KEY,
        url: url,
        strategy: "mobile",
        category: ['performance', 'seo'],
        locale: 'en',
    }
    return axios.get(BASE_URL, {params, paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: 'repeat' }), 
      })
}

export const getDesktopScore = async(url: string)=>{
    const params = {
      key: API_KEY,
        url: url,
        strategy: "desktop",
        category: ['performance', 'seo'],
        locale: 'en',
    }
     return axios.get(BASE_URL, {params, paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: 'repeat' }), 
      })
}

export const getSEOScore = async(url: string)=>{
    const params = {
         key: API_KEY,
        url: url,
        category: ['SEO'],
        locale: 'en',
    }
     return axios.get(BASE_URL, {params, paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: 'repeat' }),
      })
}