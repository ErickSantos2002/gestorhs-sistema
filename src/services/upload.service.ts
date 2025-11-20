import api from './api';

export const uploadService = {
  async uploadFile(
    file: File,
    tipo: 'imagem' | 'pdf' | 'video' | 'documento'
  ): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tipo', tipo);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  async deleteFile(url: string): Promise<void> {
    await api.delete('/upload', { data: { url } });
  },
};
