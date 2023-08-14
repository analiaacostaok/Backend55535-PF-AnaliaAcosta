import fs from 'fs'

class ProductManager {

    constructor() {
        this.path = 'Productos.json';
    }

    getProducts = async () => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const productos = JSON.parse(data);
            return productos;
        } else {
            return [];
        }
    }

    addProduct = async (title, description, code, price, stock, category, thumbnail) => {

        if (title && description && code && price && stock && category) {

            const productos = await this.getProducts();

            if (productos.some(product => product.code === code)) {
                throw new Error(`Ya existe un producto con el código # ${code}`)
            }

            const product = {
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnail
            }

            product.status = true

            if (productos.length === 0) {
                product.id = 1;
            } else {
                product.id = productos[productos.length - 1].id + 1;
            }

            productos.push(product);

            await fs.promises.writeFile(this.path, JSON.stringify(productos))

            return product

        } else {
            throw new Error('Los campos title, description, code, price, stock y category son obligatorios')
        }

    }

    getProductById = async (idProducto) => {

        const productos = await this.getProducts();

        const productIndex = productos.findIndex(product => product.id === idProducto);

        if (productIndex >= 0) {
            return productos[productIndex];
        } else {
            throw new Error(`Producto con id ${idProducto} no existe`);
        }
    }

    updateProduct = async (idProducto, propertyToUpdate, newValue) => {

        if (propertyToUpdate === 'id') {
            throw new Error(`No se puede modificar el id`)
        }
        const productos = await this.getProducts();

        const productIndex = productos.findIndex(product => product.id === idProducto);

        if (productIndex >= 0) {

            const product = productos[productIndex];

            if (propertyToUpdate === 'code' && (productos.some(product => product.code === newValue))) {
                throw new Error(`Ya existe un producto con el código # ${newValue}`)
            }
            if (product.hasOwnProperty(propertyToUpdate)) {
                product[propertyToUpdate] = newValue;
                await fs.promises.writeFile(this.path, JSON.stringify(productos));
                return product;
            } else {
                throw new Error(`La propiedad "${propertyToUpdate}" no es válida para actualizar.`);
            }
        }
    }

    deleteProduct = async (idProducto) => {
        let productos = await this.getProducts();
        const productIndex = productos.findIndex(product => product.id === idProducto);
        if (productIndex >= 0) {
            productos = productos.filter(product => product.id != idProducto);
            await fs.promises.writeFile(this.path, JSON.stringify(productos))
            return productos;
        } else {
            throw new Error(`Producto con id ${idProducto} no existe`);
        }
    }

}

export default ProductManager;






