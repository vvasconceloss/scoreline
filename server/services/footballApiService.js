import axios from "axios";

export const fetchFootballData = async (dynamicPath, dynamicQuery) => {
  const axiosOptions = {
    method: 'GET',
    url: `${process.env.API_URL}/${dynamicPath}`,
    params: dynamicQuery,
    headers: {
      'x-rapidapi-key': process.env.API_KEY,
      'x-rapidapi-host': process.env.API_HOST
    }
  }

  try {
    const footballData = await axios.request(axiosOptions);
    return footballData.data;
  } catch (err) {
    return err;
  }
}