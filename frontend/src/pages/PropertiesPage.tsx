import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Trash2,
  Home,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { Header } from '../components/layout/Header'
import { Badge } from '../components/common/Badge'
import { Modal } from '../components/common/Modal'
import { EmptyState } from '../components/common/EmptyState'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { propertyService } from '../services/propertyService'
import { useAuth } from '../context/AuthContext'
import type { Property, CreatePropertyInput, PropertyType } from '../types/property'

export const PropertiesPage: React.FC = () => {
  const { user } = useAuth()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Filters & Search
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<CreatePropertyInput>({
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    propertyType: 'residential',
  })

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await propertyService.getAll({ limit: 50 })
      setProperties(res.data || [])
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to fetch properties')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await propertyService.create(formData)
      setIsModalOpen(false)
      setFormData({
        name: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        propertyType: 'residential',
      })
      setSuccessMsg('Property created successfully!')
      setTimeout(() => setSuccessMsg(null), 3000)
      await fetchProperties()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to create property')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteProperty = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" and all its units?`)) {
      return
    }
    try {
      await propertyService.delete(id)
      setSuccessMsg(`"${name}" was deleted.`)
      setTimeout(() => setSuccessMsg(null), 3000)
      await fetchProperties()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to delete property')
      }
    }
  }

  // Filter properties client-side by search and type
  const filteredProperties = properties.filter((prop) => {
    const matchesSearch =
      prop.name.toLowerCase().includes(search.toLowerCase()) ||
      prop.city.toLowerCase().includes(search.toLowerCase()) ||
      prop.state.toLowerCase().includes(search.toLowerCase())

    const matchesType = typeFilter === 'all' || prop.propertyType === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6 pb-12">
      <Header
        title="Properties"
        subtitle="Manage Multi-Building Real Estate Assets & Occupancy Rollups"
      />

      <div className="max-w-7xl mx-auto px-6 space-y-6">
        {/* Banner Alert Feedback */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-sm text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-sm text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Top Control Bar: Search, Filter, Add Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by property name, city, or state..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 transition"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Filter Pills */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
              {(['all', 'residential', 'commercial', 'mixed'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-medium transition ${
                    typeFilter === type
                      ? 'bg-brand-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Add Property Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>New Property</span>
            </button>
          </div>
        </div>

        {/* Property Grid */}
        {loading ? (
          <LoadingSpinner label="Loading properties from database..." />
        ) : filteredProperties.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No Properties Found"
            description={
              search
                ? `No properties match your filter "${search}".`
                : 'Get started by creating your first managed building in PropertyOps.'
            }
            actionLabel={search ? 'Clear Search' : '+ Add Property'}
            onAction={search ? () => setSearch('') : () => setIsModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((prop) => {
              const stats = prop.stats || {
                totalUnits: prop.units?.length || 0,
                occupiedUnits: prop.units?.filter((u) => u.status === 'occupied').length || 0,
                vacantUnits: prop.units?.filter((u) => u.status === 'vacant').length || 0,
                maintenanceUnits: prop.units?.filter((u) => u.status === 'maintenance').length || 0,
                occupancyRate: 0,
              }

              return (
                <div
                  key={prop.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition flex flex-col justify-between shadow-sm group"
                >
                  <div>
                    {/* Header: Name & Type */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-bold text-white text-base leading-snug group-hover:text-brand-300 transition">
                        {prop.name}
                      </h3>
                      <Badge variant={prop.propertyType}>{prop.propertyType}</Badge>
                    </div>

                    {/* Address */}
                    <div className="flex items-center text-xs text-slate-400 gap-1.5 mb-5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {prop.addressLine1}
                        {prop.addressLine2 ? `, ${prop.addressLine2}` : ''}, {prop.city},{' '}
                        {prop.state} {prop.postalCode}
                      </span>
                    </div>

                    {/* Occupancy Stats Section */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Portfolio Status</span>
                        <span className="font-bold text-emerald-400">
                          {stats.occupancyRate}% Occupied
                        </span>
                      </div>

                      {/* Mini Bar */}
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                        <div
                          style={{
                            width: `${
                              stats.totalUnits > 0
                                ? (stats.occupiedUnits / stats.totalUnits) * 100
                                : 0
                            }%`,
                          }}
                          className="bg-emerald-500 h-full"
                          title={`Occupied: ${stats.occupiedUnits}`}
                        />
                        <div
                          style={{
                            width: `${
                              stats.totalUnits > 0
                                ? (stats.vacantUnits / stats.totalUnits) * 100
                                : 0
                            }%`,
                          }}
                          className="bg-sky-500 h-full"
                          title={`Vacant: ${stats.vacantUnits}`}
                        />
                        <div
                          style={{
                            width: `${
                              stats.totalUnits > 0
                                ? (stats.maintenanceUnits / stats.totalUnits) * 100
                                : 0
                            }%`,
                          }}
                          className="bg-amber-500 h-full"
                          title={`Maintenance: ${stats.maintenanceUnits}`}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/60">
                          <div className="text-[10px] text-slate-400 font-medium">Total</div>
                          <div className="font-bold text-white mt-0.5">{stats.totalUnits}</div>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/60">
                          <div className="text-[10px] text-emerald-400 font-medium">Occupied</div>
                          <div className="font-bold text-emerald-400 mt-0.5">
                            {stats.occupiedUnits}
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/60">
                          <div className="text-[10px] text-sky-400 font-medium">Vacant</div>
                          <div className="font-bold text-sky-400 mt-0.5">{stats.vacantUnits}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Card Actions */}
                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <Link
                      to={`/units?propertyId=${prop.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300 transition"
                    >
                      <Home className="w-3.5 h-3.5" />
                      <span>View Units ({stats.totalUnits})</span>
                    </Link>

                    {user?.role === 'admin' ? (
                      <button
                        onClick={() => handleDeleteProperty(prop.id, prop.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                        title="Delete Property (Admin only)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <span
                        className="p-1.5 text-slate-600 cursor-not-allowed"
                        title="Deletion restricted to Admin role"
                      >
                        <Trash2 className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal: Add Property */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Property"
        subtitle="Register a new building asset under Skyline Living Residences (Org #1)"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateProperty} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Property Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Skyline Premier Lofts"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Address Line 1 *
              </label>
              <input
                type="text"
                required
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                placeholder="100 Main St"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Address Line 2 (Optional)
              </label>
              <input
                type="text"
                value={formData.addressLine2}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                placeholder="Suite, Building, Floor"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Austin"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">State *</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="TX"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Postal Code *</label>
              <input
                type="text"
                required
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder="78701"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Property Type</label>
            <select
              value={formData.propertyType}
              onChange={(e) =>
                setFormData({ ...formData, propertyType: e.target.value as PropertyType })
              }
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="mixed">Mixed-Use</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20 disabled:opacity-50 transition"
            >
              {submitting ? 'Creating...' : 'Create Property'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
