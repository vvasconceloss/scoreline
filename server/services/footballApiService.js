import axios from "axios";

export const fetchFootballData = async (dynamicPath, dynamicQuery) => {
  const axiosOptions = {
    method: 'GET',
    url: `${process.env.API_URL}/${dynamicPath}`,
    params: dynamicQuery,
    headers: {
      'X-Auth-Token': process.env.API_KEY,
    }
  }

  try {
    const footballData = await axios.request(axiosOptions);
    return footballData.data;
  } catch (err) {
    return err;
  }
}