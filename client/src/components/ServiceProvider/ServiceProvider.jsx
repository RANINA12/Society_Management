import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ServicePerson from "./ServicePerson";
import "./ServiceProvider.css";

function ServiceProvider() {
    const location = useLocation();

    const serviceSelected = new URLSearchParams(location.search).get("service");
    const [handymen, setHandymen] = useState(null);
    const [sortedHandymen, setSortedHandymen] = useState([]);
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);

    // Fetch handymen from the backend
    useEffect(() => {
        const fetchHandymen = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_API}/api/handyman/getallhandyman`
                );
                const data = await response.json();
                setHandymen(data);
            } catch (error) {
                console.error("Failed to fetch handymen:", error);
            }
        };

        fetchHandymen();
    }, []);

    // Log once handymen are fetched
    useEffect(() => {
        if (handymen) {
            console.log("✅ Handymen fetched:", handymen);
        }
    }, [handymen]);

    // Utility: Calculate distance using Haversine formula
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of Earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) *
                Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    // Filter and sort based on service and distance
    useEffect(() => {
        if (!handymen || !serviceSelected) return;

        const userLat = parseFloat(new URLSearchParams(location.search).get("lat"));
        const userLong = parseFloat(new URLSearchParams(location.search).get("long"));

        setLat(userLat);
        setLong(userLong);

        const filtered = handymen.filter(
            (handyman) =>
                handyman.services?.toLowerCase() === serviceSelected.toLowerCase()
        );

        const sorted = filtered.sort((a, b) => {
            const distanceA = calculateDistance(userLat, userLong, a.lat, a.long);
            const distanceB = calculateDistance(userLat, userLong, b.lat, b.long);
            return distanceA - distanceB;
        });

        setSortedHandymen(sorted);
        console.log("📦 Sorted Handymen:", sorted);
    }, [handymen, serviceSelected, location.search]);

    return (
        <div className="serviceProvider_outer">
            <div className="container">
                <div className="serviceProvider_inner">
                    <div className="serviceProvider_heading">
                        <h1>
                            {serviceSelected
                                ? serviceSelected.charAt(0).toUpperCase() + serviceSelected.slice(1)
                                : "Service"}{" "}
                            near your location
                        </h1>
                        <p>Choose one to proceed for the booking</p>
                    </div>

                    {Array.isArray(sortedHandymen) && sortedHandymen.length > 0 ? (
                        sortedHandymen.map((provider) => (
                            <ServicePerson key={provider.handyman_id} {...provider} />
                        ))
                    ) : (
                        <p>No providers found for this service.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ServiceProvider;
