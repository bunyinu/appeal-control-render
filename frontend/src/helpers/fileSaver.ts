import { saveAs } from "file-saver";
import axios from "axios";

export const saveFile = async (e: any, url: string, name: string) => {
    e.stopPropagation();
    try {
        const response = await axios.get(url, { responseType: 'blob' });
        saveAs(response.data, name);
    } catch (error) {
        console.error("Download failed", error);
        alert("Failed to download file. It may be restricted.");
    }
};
