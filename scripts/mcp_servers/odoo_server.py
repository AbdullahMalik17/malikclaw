"""
Odoo MCP Server for MalikClaw

Provides MCP tools for Odoo ERP integration:
- Create customer invoices
- Record vendor bills (expenses)
- Query financial data
- List products and partners

Uses Odoo XML-RPC API.
"""

import os
import sys
import json
import logging
import xmlrpc.client
from datetime import datetime, date
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv

try:
    from fastmcp import FastMCP
except ImportError:
    print("Required package 'fastmcp' not installed. Run: pip install fastmcp")
    sys.exit(1)

# Load environment variables
load_dotenv()

# Configuration
ODOO_URL = os.getenv("ODOO_URL", "http://localhost:8069")
ODOO_DB = os.getenv("ODOO_DB", "odoo")
ODOO_USERNAME = os.getenv("ODOO_USERNAME", "admin")
ODOO_PASSWORD = os.getenv("ODOO_PASSWORD")

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("OdooMCP")

# Initialize MCP
mcp = FastMCP("Odoo Accounting")

class OdooConnection:
    """Manages Odoo XML-RPC connection."""

    def __init__(self, url: str, db: str, username: str, password: str):
        self.url = url
        self.db = db
        self.username = username
        self.password = password
        self.uid = None
        self.models = None
        self.common = None

    def connect(self):
        """Establish connection to Odoo."""
        try:
            self.common = xmlrpc.client.ServerProxy(f'{self.url}/xmlrpc/2/common')
            self.uid = self.common.authenticate(self.db, self.username, self.password, {})
            if not self.uid:
                raise Exception("Authentication failed")
            self.models = xmlrpc.client.ServerProxy(f'{self.url}/xmlrpc/2/object')
            logger.info(f"Connected to Odoo as user ID: {self.uid}")
            return True
        except Exception as e:
            logger.error(f"Failed to connect to Odoo: {e}")
            raise

    def execute(self, model: str, method: str, *args, **kwargs):
        if not self.uid or not self.models:
            self.connect()
        return self.models.execute_kw(
            self.db, self.uid, self.password,
            model, method, args, kwargs
        )

    def search(self, model: str, domain: List, limit: int = None, offset: int = 0):
        kwargs = {'offset': offset}
        if limit:
            kwargs['limit'] = limit
        return self.execute(model, 'search', domain, kwargs)

    def read(self, model: str, ids: List[int], fields: List[str] = None):
        kwargs = {}
        if fields:
            kwargs['fields'] = fields
        return self.execute(model, 'read', ids, kwargs)

    def create(self, model: str, values: Dict) -> int:
        return self.execute(model, 'create', values)

# Odoo API connection cache
_odoo_connection = None

def get_odoo() -> OdooConnection:
    global _odoo_connection
    if _odoo_connection is None:
        _odoo_connection = OdooConnection(ODOO_URL, ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD)
        _odoo_connection.connect()
    return _odoo_connection

@mcp.tool()
def create_customer_invoice(
    customer_name: str,
    invoice_lines: List[Dict[str, Any]],
    invoice_date: str = None
) -> Dict[str, Any]:
    """
    Create a customer invoice in Odoo.
    invoice_lines: list of dicts with product_name, quantity, unit_price
    """
    odoo = get_odoo()
    
    # Find or create customer
    partner_ids = odoo.search('res.partner', [('name', '=', customer_name)], limit=1)
    if partner_ids:
        partner_id = partner_ids[0]
    else:
        partner_id = odoo.create('res.partner', {'name': customer_name, 'customer_rank': 1})

    line_values = []
    for line in invoice_lines:
        p_name = line['product_name']
        qty = float(line['quantity'])
        price = float(line['unit_price'])
        
        # Find or create product
        p_ids = odoo.search('product.product', [('name', '=', p_name)], limit=1)
        if p_ids:
            p_id = p_ids[0]
        else:
            p_id = odoo.create('product.product', {'name': p_name, 'list_price': price, 'type': 'service'})
            
        line_values.append((0, 0, {
            'product_id': p_id,
            'name': p_name,
            'quantity': qty,
            'price_unit': price
        }))

    invoice_id = odoo.create('account.move', {
        'partner_id': partner_id,
        'move_type': 'out_invoice',
        'invoice_date': invoice_date or date.today().isoformat(),
        'invoice_line_ids': line_values
    })

    data = odoo.read('account.move', [invoice_id], ['name', 'amount_total', 'state'])[0]
    return {
        'invoice_id': invoice_id,
        'invoice_number': data['name'],
        'total': data['amount_total'],
        'status': data['state']
    }

@mcp.tool()
def get_financial_summary(date_from: str = None, date_to: str = None) -> Dict[str, Any]:
    """Get revenue and expense totals for a date range (YYYY-MM-DD)."""
    odoo = get_odoo()
    if not date_from: date_from = date.today().replace(day=1).isoformat()
    if not date_to: date_to = date.today().isoformat()

    def get_total(move_type):
        ids = odoo.search('account.move', [
            ('move_type', '=', move_type),
            ('state', '=', 'posted'),
            ('invoice_date', '>=', date_from),
            ('invoice_date', '<=', date_to)
        ])
        moves = odoo.read('account.move', ids, ['amount_total'])
        return sum(m['amount_total'] for m in moves)

    revenue = get_total('out_invoice')
    expenses = get_total('in_invoice')
    
    return {
        'date_from': date_from,
        'date_to': date_to,
        'revenue': revenue,
        'expenses': expenses,
        'profit': revenue - expenses
    }

@mcp.tool()
def list_products(limit: int = 10) -> List[Dict[str, Any]]:
    """List products from Odoo."""
    odoo = get_odoo()
    ids = odoo.search('product.product', [], limit=limit)
    products = odoo.read('product.product', ids, ['name', 'list_price'])
    return [{'id': p['id'], 'name': p['name'], 'price': p['list_price']} for p in products]

@mcp.tool()
def search_partners(name: str = None, limit: int = 10) -> List[Dict[str, Any]]:
    """Search for customers or vendors in Odoo."""
    odoo = get_odoo()
    domain = []
    if name:
        domain = [('name', 'ilike', name)]
    ids = odoo.search('res.partner', domain, limit=limit)
    partners = odoo.read('res.partner', ids, ['name', 'email', 'phone'])
    return [{'id': p['id'], 'name': p['name'], 'email': p.get('email'), 'phone': p.get('phone')} for p in partners]

if __name__ == "__main__":
    try:
        mcp.run()
    except Exception as e:
        logger.error(f"MCP server crashed: {e}")
        sys.exit(1)
