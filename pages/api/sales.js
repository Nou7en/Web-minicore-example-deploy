import { MongoClient, ObjectId } from 'mongodb';


async function handler(req, res) {
    //connection
    const client = await MongoClient.connect(
        'mongodb+srv://tchenzhang:tonychen777@clusterbdd.qqqpwtn.mongodb.net/'
        
    );
    //GET request
    if (req.method === 'GET') {
        const db = client.db('minicore');

        const salesCollection = db.collection('sales');
        const salesData = await salesCollection.find().toArray();
        //res.status(200).json({ sales: data });

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