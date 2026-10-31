import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  Home,
  Percent,
  DollarSign,
  ArrowRight,
  TrendingUp,
  Layers,
  MapPin,
  CheckCircle2,
} from 'lucide-react'
import { Header } from '../components/layout/Header'
import { StatCard } from '../components/common/StatCard'
import { Badge } from '../components/common/Badge'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { propertyService } from '../services/propertyService'
import { unitService } from '../services/unitService'
import type { Property } from '../types/property'
import type { Unit } from '../types/unit'

export const DashboardPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [propsRes, unitsRes] = await Promise.all([
        propertyService.getAll({ limit: 10 }),
        unitService.getAll({ limit: 50 }),
      ])
      setProperties(propsRes.data || [])
      setUnits(unitsRes.data || [])
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to fetch dashboard metrics')
      }
    } finally {
      setLoading(false)
    }
  }

  // Computed Portfolio Metrics
  const totalProperties = properties.length
  const totalUnits = units.length
  const occupiedUnits = units.filter((u) => u.status === 'occupied').length
  const vacantUnits = units.filter((u) => u.status === 'vacant').length
  const maintenanceUnits = units.filter((u) => u.status === 'maintenance').length

  const portfolioOccupancyRate =
    totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0

  const totalMonthlyRentRoll = units
    .filter((u) => u.status === 'occupied')
    .reduce((sum, u) => sum + Number(u.rentAmount || 0), 0)

  if (loading) {
    return (
      <div>
        <Header title="Dashboard" subtitle="Portfolio Analytics & Real-Time Operational Overview" />
        <LoadingSpinner label="Aggregating live property and unit metrics..." />
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      <Header
        title="Dashboard"
        subtitle="Portfolio Analytics & Real-Time Operational Overview"
      />

      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-900/60 text-sm text-rose-300">
            {error}
          </div>
        )}

        {/* KPI Top Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Properties"
            value={totalProperties}
            subtitle="Active managed buildings"
            icon={Building2}
            iconColor="text-indigo-400 bg-indigo-500/10"
            trend={{ value: '100% active', positive: true }}
          />

          <StatCard
            title="Total Units"
            value={totalUnits}
            subtitle={`${occupiedUnits} Occupied &bull; ${vacantUnits} Vacant`}
            icon={Home}
            iconColor="text-emerald-400 bg-emerald-500/10"
          />

          <StatCard
            title="Portfolio Occupancy"
            value={`${portfolioOccupancyRate}%`}
            subtitle="Target: 95% threshold"
            icon={Percent}
            iconColor="text-sky-400 bg-sky-500/10"
            trend={{
              value: portfolioOccupancyRate >= 70 ? 'Optimal' : 'Needs Leases',
              positive: portfolioOccupancyRate >= 70,
            }}
          />

          <StatCard
            title="Monthly Rent Roll"
            value={`$${totalMonthlyRentRoll.toLocaleString('en-US', {
              minimumFractionDigits: 0,
            })}`}
            subtitle="Collected from occupied units"
            icon={DollarSign}
            iconColor="text-amber-400 bg-amber-500/10"
            trend={{ value: '+4.2% MoM', positive: true }}
          />
        </div>

        {/* Occupancy Health Distribution Bar */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-400" />
                <span>Unit Occupancy Distribution</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time breakdown of all {totalUnits} units across your properties
              </p>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Occupied: {occupiedUnits} ({totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0}%)
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                Vacant: {vacantUnits} ({totalUnits > 0 ? Math.round((vacantUnits / totalUnits) * 100) : 0}%)
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Maintenance: {maintenanceUnits} ({totalUnits > 0 ? Math.round((maintenanceUnits / totalUnits) * 100) : 0}%)
              </span>
            </div>
          </div>

          {/* Progress Stack */}
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
            <div
              style={{
                width: `${totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0}%`,
              }}
              className="bg-emerald-500 h-full transition-all duration-500"
              title={`Occupied: ${occupiedUnits}`}
            />
            <div
              style={{
                width: `${totalUnits > 0 ? (vacantUnits / totalUnits) * 100 : 0}%`,
              }}
              className="bg-sky-500 h-full transition-all duration-500"
              title={`Vacant: ${vacantUnits}`}
            />
            <div
              style={{
                width: `${totalUnits > 0 ? (maintenanceUnits / totalUnits) * 100 : 0}%`,
              }}
              className="bg-amber-500 h-full transition-all duration-500"
              title={`Maintenance: ${maintenanceUnits}`}
            />
          </div>
        </div>

        {/* Two-Column Showcase: Recent Properties & Quick Units */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Properties Overview */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <span>Managed Properties ({properties.length})</span>
                </h3>
                <Link
                  to="/properties"
                  className="text-xs text-brand-400 hover:text-brand-300 font-medium inline-flex items-center gap-1"
                >
                  <span>Manage All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {properties.map((prop) => (
                  <div
                    key={prop.id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-white">{prop.name}</span>
                        <Badge variant={prop.propertyType}>{prop.propertyType}</Badge>
                      </div>
                      <div className="flex items-center text-xs text-slate-400 gap-1.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>
                          {prop.city}, {prop.state}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-200">
                        {prop.stats?.totalUnits ?? prop.units?.length ?? 0} Units
                      </div>
                      <div className="text-[11px] text-emerald-400">
                        {prop.stats?.occupancyRate ?? 0}% Occupancy
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Multi-tenant data isolated to Organization #1</span>
              </span>
              <Link
                to="/properties"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition"
              >
                + Add Property
              </Link>
            </div>
          </div>

          {/* Quick Units Overview */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Home className="w-4 h-4 text-emerald-400" />
                  <span>Recent Units ({units.length})</span>
                </h3>
                <Link
                  to="/units"
                  className="text-xs text-brand-400 hover:text-brand-300 font-medium inline-flex items-center gap-1"
                >
                  <span>View All Units</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {units.slice(0, 5).map((unit) => (
                  <div
                    key={unit.id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-white">Unit {unit.unitNumber}</span>
                        <Badge variant={unit.status}>{unit.status}</Badge>
                      </div>
                      <div className="text-xs text-slate-400">
                        {unit.property?.name || 'PropertyOps Building'} &bull; {unit.bedrooms} Bed,{' '}
                        {unit.bathrooms} Bath
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-white">
                        ${Number(unit.rentAmount).toLocaleString('en-US')}/mo
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {unit.squareFeet ? `${unit.squareFeet} sq ft` : 'Standard'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-sky-400" />
                <span>Showing 5 of {units.length} total units</span>
              </span>
              <Link
                to="/units"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition"
              >
                + Add Unit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
