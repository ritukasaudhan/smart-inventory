import { useEffect, useState } from "react";
import {
  Search,
  Users,
  MapPin,
  Globe,
} from "lucide-react";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/customers")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }

        return response.json();
      })
      .then((data) => {
        setCustomers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load customer data.");
        setLoading(false);
      });
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const searchText = search.toLowerCase();

    return (
      customer.customer_id?.toLowerCase().includes(searchText) ||
      customer.customer_unique_id?.toLowerCase().includes(searchText) ||
      customer.customer_city?.toLowerCase().includes(searchText) ||
      customer.customer_state?.toLowerCase().includes(searchText)
    );
  });

  const uniqueCities = new Set(
    customers.map((customer) => customer.customer_city)
  ).size;

  const uniqueStates = new Set(
    customers.map((customer) => customer.customer_state)
  ).size;

  return (
    <div className="customers-page">

      {/* Header */}
      <div className="products-header">
        <div>
          <h1>Customers</h1>
          <p>
            Explore customer records and geographic distribution.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="inventory-summary">

        <div className="card">
          <div className="stat-top">
            <span>Customers Loaded</span>

            <div className="stat-icon">
              <Users size={20} />
            </div>
          </div>

          <div className="stat-value">
            {customers.length}
          </div>

          <div className="stat-change">
            <span>From database</span>
          </div>
        </div>

        <div className="card">
          <div className="stat-top">
            <span>Cities Represented</span>

            <div className="stat-icon">
              <MapPin size={20} />
            </div>
          </div>

          <div className="stat-value">
            {uniqueCities}
          </div>

          <div className="stat-change">
            <span>Unique cities</span>
          </div>
        </div>

        <div className="card">
          <div className="stat-top">
            <span>States Represented</span>

            <div className="stat-icon">
              <Globe size={20} />
            </div>
          </div>

          <div className="stat-value">
            {uniqueStates}
          </div>

          <div className="stat-change">
            <span>Unique states</span>
          </div>
        </div>

      </div>

      {/* Customer Directory */}
      <div className="card">

        <div className="card-header">

          <div>
            <h2>Customer Directory</h2>

            <p>
              Customer records from the connected PostgreSQL database
            </p>
          </div>

          <div className="products-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search customers, city or state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>

        <div className="table-wrapper">

          {loading ? (
            <p style={{ padding: "24px" }}>
              Loading customers...
            </p>
          ) : error ? (
            <p style={{ padding: "24px" }}>
              {error}
            </p>
          ) : (

            <table>

              <thead>
                <tr>
                  <th>CUSTOMER ID</th>
                  <th>UNIQUE ID</th>
                  <th>CITY</th>
                  <th>STATE</th>
                </tr>
              </thead>

              <tbody>

                {filteredCustomers.map((customer) => (

                  <tr key={customer.customer_id}>

                    <td>
                      <div className="table-product">

                        <div className="table-product-icon">
                          <Users size={16} />
                        </div>

                        <strong>
                          {customer.customer_id.slice(0, 14)}...
                        </strong>

                      </div>
                    </td>

                    <td>
                      {customer.customer_unique_id.slice(0, 14)}...
                    </td>

                    <td>
                      {customer.customer_city}
                    </td>

                    <td>
                      {customer.customer_state}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </div>
  );
}

export default Customers;