import { useState } from 'react';

export function useRequerimientoForm(initialDetalles = []) {
    const [detalles, setDetalles] = useState(initialDetalles);
    const [detalleTemp, setDetalleTemp] = useState({
        producto_id: '',
        unidad_medida_id: '',
        cantidad_solicitada: '',
        precio_unitario: '',
    });

    const agregarDetalle = (productos) => {
        if (!detalleTemp.producto_id || !detalleTemp.unidad_medida_id || !detalleTemp.cantidad_solicitada) {
            alert('Complete todos los campos obligatorios');
            return;
        }

        // Validar que no esté duplicado
        const yaExiste = detalles.some(d => 
            d.producto_id === detalleTemp.producto_id && 
            d.unidad_medida_id === detalleTemp.unidad_medida_id
        );

        if (yaExiste) {
            alert('Este producto con esta unidad ya fue agregado');
            return;
        }

        // Obtener info del producto
        const producto = productos.find(p => p.id === parseInt(detalleTemp.producto_id));
        const unidad = producto?.unidades_medida?.find(u => u.id === parseInt(detalleTemp.unidad_medida_id));
        
        if (!producto || !unidad) {
            alert('Producto o unidad no encontrada');
            return;
        }

        // Calcular cantidad en unidad base
        const cantidadBase = parseFloat(detalleTemp.cantidad_solicitada) * parseFloat(unidad.factor_conversion);

        // Obtener precio (del inventario o manual)
        let precioUnitario = parseFloat(detalleTemp.precio_unitario) || 0;
        if (precioUnitario === 0 && producto.inventario) {
            precioUnitario = parseFloat(producto.inventario.precio_unitario) || 0;
        }

        const nuevoDetalle = {
            producto_id: detalleTemp.producto_id,
            producto: producto,
            unidad_medida_id: detalleTemp.unidad_medida_id,
            unidad_medida: unidad,
            cantidad_solicitada: parseFloat(detalleTemp.cantidad_solicitada),
            cantidad_unidad_base: cantidadBase,
            precio_unitario: precioUnitario,
            precio_total: cantidadBase * precioUnitario,
        };

        setDetalles([...detalles, nuevoDetalle]);
        
        // Limpiar formulario
        setDetalleTemp({
            producto_id: '',
            unidad_medida_id: '',
            cantidad_solicitada: '',
            precio_unitario: '',
        });
    };

    const eliminarDetalle = (index) => {
        setDetalles(detalles.filter((_, i) => i !== index));
    };

    const actualizarPrecio = (index, nuevoPrecio) => {
        const nuevosDetalles = [...detalles];
        nuevosDetalles[index].precio_unitario = parseFloat(nuevoPrecio);
        nuevosDetalles[index].precio_total = nuevosDetalles[index].cantidad_unidad_base * parseFloat(nuevoPrecio);
        setDetalles(nuevosDetalles);
    };

    const calcularTotales = () => {
        return {
            total_items: detalles.length,
            monto_total: detalles.reduce((sum, d) => sum + d.precio_total, 0),
        };
    };

    return {
        detalles,
        setDetalles,
        detalleTemp,
        setDetalleTemp,
        agregarDetalle,
        eliminarDetalle,
        actualizarPrecio,
        calcularTotales,
    };
}