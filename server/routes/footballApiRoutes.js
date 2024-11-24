import { fetchFootballData } from "../services/footballApiService.js";

export const footballRoutes = async (fastify) => {
  fastify.get('/:path', async (req, res) => {
    try {
      const dynamicPath = req.params.path;
      const footballData = await fetchFootballData(dynamicPath, req.query);
  
      return res.status(200).send({ footballData });
    } catch (err) {
      console.log(`Failed to receive data from external API: ${err}`);
  
      return res.status(500).send({ status: 'failed', message: `Failed to receive data from external API: ${err}` });
    }
  });
}