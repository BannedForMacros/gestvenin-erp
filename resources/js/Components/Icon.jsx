import {
    LayoutDashboard,
    ShoppingCart,
    Truck,
    Warehouse,
    Receipt,
    CreditCard,
    Package,
    Calculator,
    AlertTriangle,
    FileText,
    Settings,
    ChevronDown,
} from 'lucide-react';

export default function Icon({ name, className = "w-5 h-5" }) {
    const icons = {
        dashboard: LayoutDashboard,
        shopping: ShoppingCart,
        truck: Truck,
        warehouse: Warehouse,
        receipt: Receipt,
        creditCard: CreditCard,
        package: Package,
        calculator: Calculator,
        alert: AlertTriangle,
        chart: FileText,
        settings: Settings,
        chevronDown: ChevronDown,
    };

    const IconComponent = icons[name] || LayoutDashboard;

    return <IconComponent className={className} />;
}