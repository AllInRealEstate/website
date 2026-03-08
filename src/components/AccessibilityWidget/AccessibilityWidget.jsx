import React, { useState } from 'react';
import './AccessibilityWidget.css';

function AccessibilityWidget({ settings, onChange }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleFontSizeChange = (e) => {
        onChange({ ...settings, fontSize: e.target.value });
    };

    const handleContrastToggle = (e) => {
        onChange({ ...settings, contrast: e.target.checked });
    };

    const handleUnderlineLinksToggle = (e) => {
        onChange({ ...settings, underlineLinks: e.target.checked });
    };

    const handleTextSpacingToggle = (e) => {
        onChange({ ...settings, textSpacing: e.target.checked });
    };

    const handleStopAnimationsToggle = (e) => {
        onChange({ ...settings, stopAnimations: e.target.checked });
    };

    const resetSettings = () => {
        onChange({
            fontSize: 'default',
            contrast: false,
            underlineLinks: false,
            textSpacing: false,
            stopAnimations: false
        });
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                className="a11y-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Accessibility Options"
                aria-expanded={isOpen}
            >
                ♿
                <span className="a11y-tooltip">Accessibility</span>
            </button>

            {/* Accessibility Panel */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="a11y-backdrop"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Panel */}
                    <div className="a11y-panel" role="dialog" aria-label="Accessibility Settings">
                        <div className="a11y-header">
                            <h3>Accessibility Settings</h3>
                            <button
                                className="a11y-close-x"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>

                        {/* Font Size Control */}
                        <div className="a11y-control">
                            <label htmlFor="fontSize">
                                <span className="a11y-icon">🔤</span>
                                Font Size:
                            </label>
                            <select
                                id="fontSize"
                                value={settings.fontSize}
                                onChange={handleFontSizeChange}
                                className="a11y-select"
                            >
                                <option value="default">Default</option>
                                <option value="medium">Medium (+20%)</option>
                                <option value="large">Large (+40%)</option>
                            </select>
                        </div>

                        {/* High Contrast */}
                        <div className="a11y-control">
                            <label className="a11y-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={settings.contrast}
                                    onChange={handleContrastToggle}
                                    className="a11y-checkbox"
                                />
                                <span className="a11y-icon">⚫</span>
                                High Contrast Mode
                            </label>
                        </div>

                        {/* Underline Links */}
                        <div className="a11y-control">
                            <label className="a11y-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={settings.underlineLinks}
                                    onChange={handleUnderlineLinksToggle}
                                    className="a11y-checkbox"
                                />
                                <span className="a11y-icon">🔗</span>
                                Underline All Links
                            </label>
                        </div>

                        {/* Text Spacing */}
                        <div className="a11y-control">
                            <label className="a11y-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={settings.textSpacing}
                                    onChange={handleTextSpacingToggle}
                                    className="a11y-checkbox"
                                />
                                <span className="a11y-icon">📏</span>
                                Increase Text Spacing
                            </label>
                        </div>

                        {/* Stop Animations */}
                        <div className="a11y-control">
                            <label className="a11y-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={settings.stopAnimations}
                                    onChange={handleStopAnimationsToggle}
                                    className="a11y-checkbox"
                                />
                                <span className="a11y-icon">⏸️</span>
                                Stop Animations
                            </label>
                        </div>

                        {/* Reset Button */}
                        <div className="a11y-footer">
                            <button
                                className="a11y-reset-btn"
                                onClick={resetSettings}
                            >
                                Reset All
                            </button>
                            <button
                                className="close-btn"
                                onClick={() => setIsOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default AccessibilityWidget;