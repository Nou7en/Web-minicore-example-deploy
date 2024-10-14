import { MongoClient, ObjectId } from 'mongodb';

async function handler(req, res) {
    // Obtener la URI desde las variables de entorno
    const uri = process.env.MONGODB_URI;

    // Conectar a MongoDB usando la URI
    const client = await MongoClient.connect(uri);
    
    // GET request
    if (req.method === 'GET') {
        const db = client.db('minicore');

        const salesCollection = db.collection('sales');
        const salesData = await salesCollection.find().toArray();

        // Obtener el nombre del vendedor para cada venta
        const salesWithSellerName = await Promise.all(
            salesData.map(async (sale) => {
                const sellersCollection = db.collection('seller');
                const seller = await sellersCollection.findOne({ _id: new ObjectId(sale.sellerId) });
                const saleWithSellerName = { ...sale, sellerName: seller ? seller.name : 'Vendedor desconocido' };
                return saleWithSellerName;
            })
        );

        res.status(200).json({ sales: salesWithSellerName });
    }

    client.close();
}


export default handler;
