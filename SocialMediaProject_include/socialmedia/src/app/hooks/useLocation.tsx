"use client";

import axios, { AxiosResponse } from "axios";
import { useEffect, useState, useCallback } from "react";

export interface PositionType {
  text: string;
  latitude: number;
  longitude: number;
}

interface UserLocationState {
  location: PositionType | null;
  loading: boolean;
  error: string | null;
}

const GEOCODING_URL = process.env.NEXT_PUBLIC_GEOCODING_URL;
const GEOCODING_API_KEY = process.env.NEXT_PUBLIC_GEOCODING_API_KEY;

export function useLocation(autoFetch: boolean = true) {
  const [state, setState] = useState<UserLocationState>({
    location: null,
    loading: false,
    error: null,
  });

  const fetchLocation = useCallback(async () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setState({
        location: null,
        loading: false,
        error: "Geolocation not supported",
      });
      return;
    }

    if (!GEOCODING_URL || !GEOCODING_API_KEY) {
      setState({
        location: null,
        loading: false,
        error: "Geocoding configuration is missing",
      });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const url : string = `${GEOCODING_URL}lat=${latitude}&lon=${longitude}&limit=1&appid=${GEOCODING_API_KEY}`;
          const response : AxiosResponse = await axios.get(url);

          if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
            setState({
              location: null,
              loading: false,
              error: "Location not found",
            });
            return;
          }

          const [{ name, country }] = response.data;

          const locationName = name || 'Unknown';
          const locationCountry = country || 'Unknown';

          setState({
            location: {
              latitude,
              longitude,
              text: `${locationName}, ${locationCountry}`,
            },
            loading: false,
            error: null,
          });
        } catch (err) {
          setState({
            location: null,
            loading: false,
            error: "Failed to resolve location name",
          });
        }
      },
      (err) => {
        setState({
          location: null,
          loading: false,
          error:
            err.code === 1
              ? "Location permission denied"
              : "Failed to retrieve location",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    if (autoFetch) fetchLocation();
    
  }, [autoFetch, fetchLocation]);

  return {
    location: state.location,
    loading: state.loading,
    error: state.error,
  };
}
