import React from 'react';

export default function Carousel({ images = [], itemId, cardHeight = "280px" }) {
    const defaultImage = "https://via.placeholder.com/300x150?text=No+Image";

    // Filter out null/undefined/empty/whitespace-only strings
    const validImages = images.filter(
        (img) => typeof img === "string" && img.trim() !== ""
    );
    const finalImages = validImages.length > 0 ? validImages : [defaultImage];

    const carouselId = `carousel-${itemId}`;

    return (
        <div id={carouselId} className="carousel slide" data-bs-ride="carousel" style={{ height: cardHeight }}>
            {finalImages.length > 1 && (
                <div className="carousel-indicators">
                    {finalImages.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            data-bs-target={`#${carouselId}`}
                            data-bs-slide-to={index}
                            className={index === 0 ? 'active' : ''}
                            aria-current={index === 0 ? 'true' : undefined}
                            aria-label={`Slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            <div className="carousel-inner" style={{ height: "100%" }}>
                {finalImages.map((img, index) => (
                    <div
                        key={index}
                        className={`carousel-item ${index === 0 ? 'active' : ''}`}
                        style={{ height: "100%" }}
                    >
                        <img
                            src={img}
                            onError={(e) => { e.target.src = defaultImage; }}
                            className="d-block w-100 h-100"
                            alt={`Slide ${index + 1}`}
                            style={{ 
                                objectFit: "cover",
                                width: "100%",
                                height: "100%"
                            }}
                        />
                    </div>
                ))}
            </div>

            {finalImages.length > 1 && (
                <>
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target={`#${carouselId}`}
                        data-bs-slide="prev"
                    >
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target={`#${carouselId}`}
                        data-bs-slide="next"
                    >
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </>
            )}
        </div>
    );
}