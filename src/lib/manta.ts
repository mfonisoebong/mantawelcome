import MantaClient from "mantahq-sdk";

export const manta = new MantaClient({
	sdkKey: import.meta.env.VITE_MANTA_SDK_KEY,
});
