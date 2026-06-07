
        let stockProductos = JSON.parse(localStorage.getItem('productos_stock')) || [];
        let listaTicket = JSON.parse(localStorage.getItem('lista_ticket')) || [];

        function cargarInventario() {
            let $inventario = $('.inventario');
            $inventario.empty(); 

            if (stockProductos.length === 0) {
                $inventario.html('<p class="aviso">No hay productos en el inventario.</p>');
                return;
            }

            
            stockProductos.forEach(function(producto) {
                let estructuraProducto = `
                    <div class="item-producto">
                        <span><strong>${producto.nombre}</strong> - $${producto.precio.toFixed(2)}</span>
                        <button class="btn-añadir" data-id="${producto.id}">Añadir</button>
                    </div>
                `;
                
                $inventario.append(estructuraProducto);
            });
        }

        function actualizarPantallaTotales(subtotal) {
    
    if (subtotal === undefined) {
        subtotal = listaTicket.reduce((suma, item) => suma + (item.precio * item.cantidad), 0);
    }

    let descuento = parseFloat($('#input-descuento').val()) || 0;


    let totalFinal = subtotal * (1 - descuento / 100);

    if (totalFinal < 0) { totalFinal = 0; }

    $('#total-precio').text(totalFinal.toFixed(2));
}


$('#input-descuento').on('input', function() {
    actualizarPantallaTotales();
});

        function cargarTicket() {
    let $ticket = $('.ticket');
    $ticket.empty(); 

    let subtotal = 0;

    if (listaTicket.length === 0) {
        $ticket.html('<p>El ticket está vacío.</p>');
        actualizarPantallaTotales(0);
        return;
    }

    listaTicket.forEach(function(item) {
        let precioTotalItem = item.precio * item.cantidad;
        subtotal += precioTotalItem;

        let estructuraTicket = `
            <div class="item-ticket">
                <span><strong>x${item.cantidad}</strong> ${item.nombre}</span>
                <span>$${precioTotalItem.toFixed(2)}</span>
            </div>
        `;
        $ticket.append(estructuraTicket);
    });
     $(".cantidad").text("Cantidad: " + listaTicket.length)
    actualizarPantallaTotales(subtotal);
}
        
        $('#btn-limpiar-ticket').on('click', function() {
   
            listaTicket = [];

            $('#input-descuento').val(0);
            localStorage.setItem('lista_ticket', JSON.stringify(listaTicket));
            cargarTicket();
        });
        
        $('.inventario').on('click', '.btn-añadir', function() {
    let idProducto = $(this).data('id');
    let $boton = $(this);

    let productoSeleccionado = stockProductos.find(p => p.id === idProducto);

    if (productoSeleccionado) {
        let productoEnTicket = listaTicket.find(item => item.id === idProducto);

        if (productoEnTicket) {
            productoEnTicket.cantidad += 1;
        } else {
            let nuevoItem = { ...productoSeleccionado, cantidad: 1 };
            listaTicket.push(nuevoItem);
        }

        localStorage.setItem('lista_ticket', JSON.stringify(listaTicket));
        cargarTicket();


        let textoOriginal = $boton.html(); 
        $boton.html('<i class="fa-solid fa-check"></i>');
        $boton.css({ 'background-color': '#376d68', 'color': 'white', 'pointer-events': 'none' });
        setTimeout(function() {
            $boton.html(textoOriginal);
            $boton.css({ 'background-color': '', 'color': '', 'pointer-events': 'auto' });
        }, 1000);
    }
});

        $(document).ready(function() {
            cargarInventario();
            cargarTicket();
        });