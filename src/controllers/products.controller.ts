import type { Request, Response } from "express";
import pool from "../conf/dbConnection.ts";

export class ProductController {
  //Obtener Todos los productos
  async getProducts(_req: Request, res: Response) {
    try {
      const query = "SELECT * FROM products WHERE active = TRUE";
      const [rows] = await pool.execute(query);
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ message: "internal server error" });
    }
  }

  //Obtener Producto por ID
  async getProductById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id) || id <= 0) {
        res.status(400).json({ message: "id must be a positive number" });
        return;
      }

      const [result] = (await pool.execute("SELECT * FROM products WHERE id = ? AND active = TRUE",[id])) as any;
      if (!result || result.length === 0) {
        res.status(404).json({ message: "product not found" });
        return;
      }

      res.status(200).json(result[0]);
    } catch (err) {
      res.status(500).json({ message: "internal server error" });
    }
  }

  //Crear Producto
  async createProduct(req: Request, res: Response) {
    try {
      const { name, price, stock, description, brand = null, img = null } = req.body;
      if (!name || typeof name !== "string" || name.trim() === "") {
        res.status(400).json({ message: "name is required" });
        return;
      }

      const numPrice = Number(price);
      if (Number.isNaN(numPrice) || numPrice <= 0) {
        res.status(400).json({ message: "price must be a number greater than 0" });
        return;
      }

      const numStock = Number(stock);
      if (Number.isNaN(numStock) || numStock < 0) {
        res.status(400).json({ message: "stock must be a valid number" });
        return;
      }

      if (!description || typeof description !== "string") {
        res.status(400).json({ message: "description is required" });
        return;
      }

      const query = `INSERT INTO products (name, price, stock, description, brand, img, active) VALUES (?, ?, ?, ?, ?, ?, TRUE)`;
      const [result] = (await pool.execute(query, [name.trim(),numPrice,numStock,description.trim(),brand,img,])) as any;
      res.status(201).json({message: "product created",productId: result.insertId,});
    } catch (err) {
      res.status(500).json({ message: "internal server error" });
    }
  }

  //Actualizar producto (Completo)
  async updateProductById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id) || id <= 0) {
        res.status(400).json({ message: "id must be a positive number" });
        return;
      }

      const { name, price, stock, description, brand = null, img = null } = req.body;
      if (!name || typeof name !== "string" || name.trim() === "") {
        res.status(400).json({ message: "name is required" });
        return;
      }

      const numPrice = Number(price);
      if (Number.isNaN(numPrice) || numPrice <= 0) {
        res.status(400).json({ message: "price must be a number greater than 0" });
        return;
      }

      const numStock = Number(stock);
      if (Number.isNaN(numStock) || numStock < 0) {
        res.status(400).json({ message: "stock must be a valid number" });
        return;
      }

      if (!description || typeof description !== "string") {
        res.status(400).json({ message: "description is required" });
        return;
      }

      const query = `UPDATE products SET name = ?, price = ?, stock = ?, description = ?, brand = ?, img = ? WHERE id = ? AND active = TRUE`;
      const [result] = (await pool.execute(query,[name.trim(),numPrice,numStock,description.trim(),brand,img,id,])) as any;
      if (result.affectedRows > 0) {
        return res.status(200).json({ message: "product updated" });
      }

      res.status(404).json({ message: "product not found" });
    } catch (err) {
      res.status(500).json({ message: "internal server error" });
    }
  }

  //Borrar / desactivar producto
  async deleteProductById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id) || id <= 0) {
        res.status(400).json({ message: "id must be a positive number" });
        return;
      }

      const query = "UPDATE products SET active = FALSE WHERE id = ? AND active = TRUE";
      const [result] = (await pool.execute(query,[id])) as any;
      if (result.affectedRows > 0) {
        return res.status(200).json({ message: `product with id ${id} deactivated` });
      }

      res.status(404).json({ message: "product not found" });
    } catch (err) {
      res.status(500).json({ message: "internal server error" });
    }
  }

  //Cambiar Precio
  async changePriceById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id) || id <= 0) {
        res.status(400).json({ message: "id must be a positive number" });
        return;
      }

      const { price } = req.body;
      const numPrice = Number(price);
      if (price === undefined || Number.isNaN(numPrice) || numPrice <= 0) {
        res.status(400).json({ message: "price must be a number greater than 0" });
        return;
      }

      const query = "UPDATE products SET price = ? WHERE id = ? AND active = TRUE";
      const [result] = (await pool.execute(query,[numPrice, id])) as any;
      if (result.affectedRows > 0) {
        return res.status(200).json({ message: "price updated" });
      }

      res.status(404).json({ message: "product not found" });
    } catch (err) {
      res.status(500).json({ message: "internal server error" });
    }
  }
}