import { useEffect, useRef } from "react";

interface WakeLockSentinel {
	release: () => Promise<void>;
}

export const useWakeLock = () => {
	const wakeLockRef = useRef<WakeLockSentinel | null>(null);

	useEffect(() => {
		const requestWakeLock = async () => {
			if ("wakeLock" in navigator) {
				try {
					wakeLockRef.current = await navigator.wakeLock.request("screen");
				} catch (err) {
					console.error("Wake Lock error: ", err);
				}
			}
		};

		requestWakeLock();

		const handleVisibilityChange = () => {
			if (document.visibilityState === "visible") {
				requestWakeLock();
			}
		};

		document.addEventListener("visibilityChange", handleVisibilityChange);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			wakeLockRef.current?.release();
		};
	}, []);

	return null;
};
