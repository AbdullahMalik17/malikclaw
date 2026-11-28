"""Offline tests for the Odoo MCP tools and their protocol annotations."""

import importlib.util
import sys
import types
from pathlib import Path
from unittest.mock import Mock


EXPECTED_ANNOTATIONS = {
    "create_customer_invoice": {
        "readOnlyHint": False,
        "destructiveHint": False,
        "idempotentHint": False,
        "openWorldHint": True,
    },
    "get_financial_summary": {
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": True,
        "openWorldHint": True,
    },
    "list_products": {
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": True,
        "openWorldHint": True,
    },
    "search_partners": {
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": True,
        "openWorldHint": True,
    },
}


class MockFastMCP:
    def __init__(self, _name):
        self.tools = {}

    def tool(self, *, annotations):
        def register(function):
            self.tools[function.__name__] = annotations
            return function

        return register


fastmcp = types.ModuleType("fastmcp")
fastmcp.FastMCP = MockFastMCP
dotenv = types.ModuleType("dotenv")
dotenv.load_dotenv = Mock()
sys.modules.setdefault("fastmcp", fastmcp)
sys.modules.setdefault("dotenv", dotenv)

module_name = "odoo_server_under_test"
module_path = Path(__file__).with_name("odoo_server.py")
spec = importlib.util.spec_from_file_location(module_name, module_path)
odoo_server = importlib.util.module_from_spec(spec)
sys.modules[module_name] = odoo_server
spec.loader.exec_module(odoo_server)


def test_all_tools_publish_explicit_boolean_annotations():
    assert set(odoo_server.mcp.tools) == set(EXPECTED_ANNOTATIONS)
    for tool_name, expected in EXPECTED_ANNOTATIONS.items():
        actual = odoo_server.mcp.tools[tool_name]
        assert actual == expected
        assert set(actual) == {
            "readOnlyHint",
            "destructiveHint",
            "idempotentHint",
            "openWorldHint",
        }
        assert all(type(value) is bool for value in actual.values())


def test_create_customer_invoice_uses_mocked_odoo():
    odoo = Mock()
    odoo.search.side_effect = [[], []]
    odoo.create.side_effect = [41, 73, 99]
    odoo.read.return_value = [{"name": "INV/2026/001", "amount_total": 25, "state": "draft"}]
    odoo_server.get_odoo = Mock(return_value=odoo)

    result = odoo_server.create_customer_invoice(
        "Customer", [{"product_name": "Consulting", "quantity": 1, "unit_price": 25}]
    )

    assert result == {
        "invoice_id": 99,
        "invoice_number": "INV/2026/001",
        "total": 25,
        "status": "draft",
    }
    assert odoo.create.call_count == 3


def test_get_financial_summary_uses_mocked_odoo():
    odoo = Mock()
    odoo.search.side_effect = [[1], [2]]
    odoo.read.side_effect = [[{"amount_total": 100}], [{"amount_total": 35}]]
    odoo_server.get_odoo = Mock(return_value=odoo)

    result = odoo_server.get_financial_summary("2026-01-01", "2026-01-31")

    assert result == {
        "date_from": "2026-01-01",
        "date_to": "2026-01-31",
        "revenue": 100,
        "expenses": 35,
        "profit": 65,
    }


def test_list_products_uses_mocked_odoo():
    odoo = Mock()
    odoo.search.return_value = [1]
    odoo.read.return_value = [{"id": 1, "name": "Consulting", "list_price": 25}]
    odoo_server.get_odoo = Mock(return_value=odoo)

    assert odoo_server.list_products() == [{"id": 1, "name": "Consulting", "price": 25}]


def test_search_partners_uses_mocked_odoo():
    odoo = Mock()
    odoo.search.return_value = [2]
    odoo.read.return_value = [{"id": 2, "name": "Customer", "email": "c@example.test"}]
    odoo_server.get_odoo = Mock(return_value=odoo)

    assert odoo_server.search_partners("Customer") == [
        {"id": 2, "name": "Customer", "email": "c@example.test", "phone": None}
    ]
