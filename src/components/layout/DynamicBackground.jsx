import './DynamicBackground.css';

export default function DynamicBackground() {
    return (
        <div className="dynamic-background">
            {/* Moving grid overlay */}
            <div className="bg-grid"></div>

            {/* Animated fluid blobs */}
            <div className="bg-blobs">
                <div className="bg-blob bg-blob-1"></div>
                <div className="bg-blob bg-blob-2"></div>
                <div className="bg-blob bg-blob-3"></div>
                <div className="bg-blob bg-blob-4"></div>
            </div>

            <div className="bg-noise"></div>
        </div>
    );
}
