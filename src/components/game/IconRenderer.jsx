import { X, Circle, Triangle, Square, Hexagon, Star } from 'lucide-react';

const icons = { X, Circle, Triangle, Square, Hexagon, Star };

const IconRenderer = ({ iconName, ...props }) => {
    const Icon = icons[iconName];
    return Icon ? <Icon {...props} /> : null;
};

export default IconRenderer;
