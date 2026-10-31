import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Home,
  Plus,
  Search,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { Header } from '../components/layout/Header'
import { Badge } from '../components/common/Badge'
import { Modal } from '../components/common/Modal'
import { EmptyState } from '../components/common/EmptyState'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { unitService } from '../services/unitService'
import { propertyService } from '../services/propertyService'
import type { Unit, CreateUnitInput, UnitStatus } from '../types/unit'
import type { Property } from '../types/property'

export const UnitsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialPropertyId = searchParams.get('propertyId')

  const [units, setUnits] = useState<Unit[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    initialPropertyId || 'all'
  )

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreateUnitInput>({
    propertyId: 1,
    unitNumber: '',
    floor: 1,
    bedrooms: 1,
    bathrooms: 1.0,
    squareFeet: 750,
    rentAmount: 1800,
    status: 'vacant',
  })

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    if (initialPropertyId) {
      setSelectedPropertyId(initialPropertyId)
    }
  }, [initialPropertyId])

  const fetchInitialData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [unitsRes, propsRes] = await Promise.all([
        unitService.getAll({ limit: 100 }),
        propertyService.getAll({ limit: 50 }),
      ])
      setUnits(unitsRes.data || [])
      setProperties(propsRes.data || [])
      if (propsRes.data && propsRes.data.length > 0) {
        setFormData((prev) => ({ ...prev, propertyId: propsRes.data[0].id }))
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to fetch units data')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUnit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setModalError(null)
    try {
      await unitService.create({
        ...formData,
        propertyId: Number(formData.propertyId),
        rentAmount: Number(formData.rentAmount),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        floor: formData.floor ? Number(formData.floor) : undefined,
        squareFeet: formData.squareFeet ? Number(formData.squareFeet) : undefined,
      })
      setIsModalOpen(false)
      setFormData({
        propertyId: properties[0]?.id || 1,
        unitNumber: '',
        floor: 1,
        bedrooms: 1,
        bathrooms: 1.0,
        squareFeet: 750,
        rentAmount: 1800,
        status: 'vacant',
      })
      setSuccessMsg('Unit created successfully!')
      setTimeout(() => setSuccessMsg(null), 3000)
      const res = await unitService.getAll({ limit: 100 })
      setUnits(res.data || [])
    } catch (err: unknown) {
      if (err instanceof Error) {
        setModalError(err.message)
      } else {
        setModalError('Failed to create unit')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteUnit = async (id: number, unitNumber: string) => {
    if (!window.confirm(`Are you sure you want to delete Unit ${unitNumber}?`)) {
      return
    }
    try {
      await unitService.delete(id)
      setSuccessMsg(`Unit ${unitNumber} was deleted.`)
      setTimeout(() => setSuccessMsg(null), 3000)
      const res = await unitService.getAll({ limit: 100 })
      setUnits(res.data || [])
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to delete unit')
      }
    }
  }

  const handlePropertyFilterChange = (val: string) => {
    setSelectedPropertyId(val)
    if (val === 'all') {
      searchParams.delete('propertyId')
    } else {
      searchParams.set('propertyId', val)
    }
    setSearchParams(searchParams)
  }

  // Filter Units client-side
  const filteredUnits = units.filter((unit) => {
    const matchesSearch = unit.unitNumber.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || unit.status === statusFilter
    const matchesProperty =
      selectedPropertyId === 'all' || unit.propertyId === Number(selectedPropertyId)

    return matchesSearch && matchesStatus && matchesProperty
  })

  return (
    <div className="space-y-6 pb-12">
      <Header
        title="Units & Leases"
        subtitle="Manage Unit Inventories, Rent Amounts, and Occupancy Statuses"
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

        {/* Top Control Bar: Search, Property Filter, Status Pills, Add Unit */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search unit number (e.g. 101, Loft A)..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 transition"
              />
            </div>

            {/* Property Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedPropertyId}
                onChange={(e) => handlePropertyFilterChange(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="all">All Properties ({properties.length})</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Pills */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
              {(['all', 'vacant', 'occupied', 'maintenance'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-medium transition ${
                    statusFilter === status
                      ? 'bg-brand-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Add Unit Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>New Unit</span>
            </button>
          </div>
        </div>

        {/* Units Data Table */}
        {loading ? (
          <LoadingSpinner label="Loading unit inventory..." />
        ) : filteredUnits.length === 0 ? (
          <EmptyState
            icon={Home}
            title="No Units Found"
            description={
              search || statusFilter !== 'all' || selectedPropertyId !== 'all'
                ? 'No units match your selected filter criteria.'
                : 'No units added to this property yet.'
            }
            actionLabel={
              search || statusFilter !== 'all' || selectedPropertyId !== 'all'
                ? 'Reset Filters'
                : '+ Add Unit'
            }
            onAction={
              search || statusFilter !== 'all' || selectedPropertyId !== 'all'
                ? () => {
                    setSearch('')
                    setStatusFilter('all')
                    handlePropertyFilterChange('all')
                  }
                : () => setIsModalOpen(true)
            }
          />
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Unit</th>
                    <th className="py-3.5 px-6">Building</th>
                    <th className="py-3.5 px-6">Bedrooms / Bath</th>
                    <th className="py-3.5 px-6">Size</th>
                    <th className="py-3.5 px-6">Rent Amount</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs text-slate-300">
                  {filteredUnits.map((unit) => (
                    <tr
                      key={unit.id}
                      className="hover:bg-slate-800/40 transition group"
                    >
                      {/* Unit Number */}
                      <td className="py-4 px-6 font-semibold text-white">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center font-bold text-xs">
                            {unit.unitNumber.slice(0, 3)}
                          </div>
                          <span>Unit {unit.unitNumber}</span>
                        </div>
                      </td>

                      {/* Property Name */}
                      <td className="py-4 px-6">
                        <div className="font-medium text-slate-200">
                          {unit.property?.name || 'PropertyOps Building'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {unit.property?.city}, {unit.property?.state}
                        </div>
                      </td>

                      {/* Specs */}
                      <td className="py-4 px-6 text-slate-300">
                        {unit.bedrooms === 0 ? 'Studio' : `${unit.bedrooms} Bed`},{' '}
                        {unit.bathrooms} Bath
                        {unit.floor && (
                          <span className="block text-[11px] text-slate-400">
                            Floor {unit.floor}
                          </span>
                        )}
                      </td>

                      {/* Square Feet */}
                      <td className="py-4 px-6 text-slate-400 font-mono">
                        {unit.squareFeet ? `${unit.squareFeet} sq ft` : '—'}
                      </td>

                      {/* Rent */}
                      <td className="py-4 px-6 font-semibold text-white">
                        ${Number(unit.rentAmount).toLocaleString('en-US')}/mo
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <Badge variant={unit.status}>{unit.status}</Badge>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDeleteUnit(unit.id, unit.unitNumber)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                          title="Delete Unit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
              <span>
                Showing {filteredUnits.length} of {units.length} total units
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                PostgreSQL table: units
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add Unit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Unit"
        subtitle="Create an individual residence unit under a managed property"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateUnit} className="space-y-4">
          {modalError && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{modalError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Property *
            </label>
            <select
              required
              value={formData.propertyId}
              onChange={(e) =>
                setFormData({ ...formData, propertyId: Number(e.target.value) })
              }
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.city}, {p.state})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Unit Number *
              </label>
              <input
                type="text"
                required
                value={formData.unitNumber}
                onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                placeholder="e.g. 302, Penthouse 4"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Monthly Rent ($) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="50"
                value={formData.rentAmount}
                onChange={(e) =>
                  setFormData({ ...formData, rentAmount: Number(e.target.value) })
                }
                placeholder="1850"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Bedrooms</label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.bedrooms}
                onChange={(e) =>
                  setFormData({ ...formData, bedrooms: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Bathrooms</label>
              <input
                type="number"
                min="0.5"
                max="10"
                step="0.5"
                value={formData.bathrooms}
                onChange={(e) =>
                  setFormData({ ...formData, bathrooms: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Floor</label>
              <input
                type="number"
                value={formData.floor || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    floor: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                placeholder="e.g. 3"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Square Feet (Optional)
              </label>
              <input
                type="number"
                min="100"
                value={formData.squareFeet || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    squareFeet: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                placeholder="850"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as UnitStatus })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="vacant">Vacant</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
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
              {submitting ? 'Creating...' : 'Create Unit'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
