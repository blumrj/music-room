import axios from "axios";

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: "/api",
      withCredentials: true,
    });
  }

  /*AUTH */

  async getSession() {
    try {
      const { data } = await this.client.get("/auth/me");
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Session Failed");
    }
  }

  async login(email, password) {
    try {
      const { data } = await this.client.post("/auth/login", {
        email,
        password,
      });
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Login Failed");
    }
  }

  async logout() {
    const { data } = await this.client.post("/auth/logout");
    return data;
  }

  /*TRACKS */

  async getTracks() {
    try {
      const { data } = await this.client.get("/tracks");
      return data;
    } catch (err) {
      throw new Error(
        err.response?.data?.error ||
          "An error occured. Unable to fetch tracks.",
      );
    }
  }

  async getPreviewUrl(id) {
    try {
      const { data } = await this.client.get(`/tracks/${id}/preview-url`);
      return data;
    } catch (err) {
      throw new Error(
        err.response?.data?.error || "Unable to get track preview",
      );
    }
  }

  async addTrack(deezerId, note) {
    try {
      const { data } = await this.client.post("/tracks", { deezerId, note });
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Unable to add this track");
    }
  }

  async deleteTrack(id) {
    try {
      const { data } = await this.client.delete(`/tracks/${id}`);
      return data;
    } catch (err) {
      throw new Error(
        err.response?.data?.error || "Unable to remove this track",
      );
    }
  }

  async reorderTracks(orderedIds) {
    try {
      const { data } = await this.client.put("/tracks/order", { orderedIds });
      return data;
    } catch (err) {
      throw new Error(
        err.response?.data?.error || "Unable to reorder this track",
      );
    }
  }

  /*DEEZER */

  async searchDeezer(query) {
    try {
      const { data } = await this.client.get("/deezer/search", {
        params: { q: query },
      });
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Unable to search Deezer");
    }
  }
}

export default new ApiClient();
