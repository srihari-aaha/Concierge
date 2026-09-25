import React from 'react';
import { Check } from 'lucide-react';
import './Timeline.css';

export default function Timeline({
  steps = [],
  currentStepIndex = 0,
  orientation = 'horizontal' // horizontal or vertical
}) {
  return (
    <div className={`timeline-wrapper timeline-${orientation}`}>
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStepIndex;
        const isCurrent = idx === currentStepIndex;
        const isUpcoming = idx > currentStepIndex;

        return (
          <div
            key={step.label || idx}
            className={`timeline-step ${isCompleted ? 'step-completed' : ''} ${isCurrent ? 'step-current' : ''} ${isUpcoming ? 'step-upcoming' : ''}`}
          >
            <div className="timeline-marker-col">
              <div className="timeline-node">
                {isCompleted ? (
                  <Check size={14} className="timeline-check-icon" />
                ) : (
                  <span className="timeline-number">{idx + 1}</span>
                )}
              </div>
              {idx < steps.length - 1 && <div className="timeline-connector" />}
            </div>
            <div className="timeline-info">
              <div className="timeline-label">{step.label}</div>
              {step.time && <div className="timeline-time">{step.time}</div>}
              {step.description && <div className="timeline-desc">{step.description}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
