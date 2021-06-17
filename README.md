"# finance-api"
Para resolver a la recurrente pregunta “¿En qué se me fue el sueldo?” creamos FINANCE. Es una app dónde podrás registrar cada movimiento de dinero que hagas, para que siempre sepas en qué gastas y en base a esa información reducir o ajustar tus gastos.

FUNCIONALIDADES:
Creación de usuario.
Autenticación de usuario.
Registrar movimientos.
Consultar balance de cuenta.
Crear categorías de gastos e ingresos.

ROLES:
Usuario

INSTRUCCIONES TÉCNICAS
Ejecución:

- npm install
- npn start

//FALTA//
Setear los valores: …. En las variables de entorno:

ENDPOINDS DE LA API:

    USUARIO:

        OBTENER
        GET /api/users/id

        REGISTRARSE
        POST /api/users

        MODIFICAR DATOS
        PUT /api/users/userId

        ELIMINAR
        DELETE /api/users/id

    TRANSACCIONES:
        OBTENER
        GET /api/transactions/userId

        AGREGAR
        POST /api/transactions/userId

        ELIMINAR
        DELETE /api/transactions/transactionId

        MODIFICAR
        PUT /api/transactions/userId

//VER BIEN //
CATEGORIAS:
OBTENER
GET /api/categories/id

        AGREGAR
        POST /api/categories

        MODIFICAR DATOS
        PUT /api/categories/userId

        ELIMINAR
        DELETE /api/categories/categoryId

    TRANSFERENCIAS:
     OBTENER
        GET /api/transfers/id

        AGREGAR
        POST /api/transfers

        MODIFICAR DATOS
        PUT /api/transfers/userId

        ELIMINAR
        DELETE /api/transfers/transferId

    CUENTAS:
        OBTENER
        GET /api/accounts/id

        AGREGAR
        POST /api/accounts

        MODIFICAR DATOS
        PUT /api/accounts/userId

        ELIMINAR
        DELETE /api/accounts/accountId
