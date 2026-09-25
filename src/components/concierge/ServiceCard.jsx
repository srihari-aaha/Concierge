import React from 'react';
import {
  Car,
  Sparkles,
  UtensilsCrossed,
  ShoppingBag,
  Compass,
  Wrench,
  HeartHandshake,
  Clock,
  ArrowRight
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import './ServiceCard.css';

const ICON_MAP = {
  transportation: Car,
  housekeeping: Sparkles,
  dining: UtensilsCrossed,
  grocery: ShoppingBag,
  experiences: Compass,
  maintenance: Wrench,
  special: HeartHandshake
};

export default function ServiceCard({ service, onRequest }) {
  const Icon = ICON_MAP[service.category] || Sparkles;

  return (
    <div className="service-card">
      <div className="service-card-top">
        <div className="service-icon-box">
          <Icon size={22} className="service-category-icon" />
        </div>
        <div className="service-badge-wrap">
          {service.popular && (
            <Badge variant="accent" size="sm">
              Popular Request
            </Badge>
          )}
          <Badge variant="sage" size="sm">
            {service.category.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="service-card-body">
        <h4 className="service-card-title">{service.title}</h4>
        <p className="service-card-desc">{service.shortDesc}</p>

        <div className="service-availability">
          <Clock size={13} className="clock-icon" />
          <span>{service.availability}</span>
        </div>
      </div>

      <div className="service-card-footer">
        <div className="service-price-block">
          {service.price > 0 ? (
            <>
              <span className="service-price">₹{service.price.toLocaleString('en-IN')}</span>
              <span className="service-unit">{service.priceUnit}</span>
            </>
          ) : (
            <span className="service-complimentary">Complimentary with Stay</span>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={ArrowRight}
          iconPosition="right"
          onClick={() => onRequest(service)}
        >
          Request
        </Button>
      </div>
    </div>
  );
}
