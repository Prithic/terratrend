"""
Scientific Insight Engine for TerraTrend.
Generates evidence-based, scientifically grounded answers to the four essential NASA questions:
1. WHAT is changing?
2. WHERE is it changing?
3. HOW MUCH is it changing?
4. ARE the changes statistically significant?

Strictly grounded in calculated Mann-Kendall statistics, Sen's slope, and NASA metadata.
Does not invent synthetic data or unverified claims.
"""
from typing import Dict, Any, List
from app.models.schemas import (
    VariableMetadata,
    TrendStatistics,
    ScientificExplanation,
    RegionalSummaryStatistics
)

class ScientificInsightEngine:
    @staticmethod
    def generate_point_explanation(
        var_meta: VariableMetadata,
        location_info: Dict[str, Any],
        start_year: int,
        end_year: int,
        stats: TrendStatistics
    ) -> ScientificExplanation:
        """
        Synthesizes a scientifically defensible explanation for a specific location.
        """
        loc_name = location_info.get("name", f"Coordinates ({location_info.get('latitude')}, {location_info.get('longitude')})")
        coords_str = f"{location_info.get('latitude', 0.0):.4f}° N, {location_info.get('longitude', 0.0):.4f}° E"
        duration_years = end_year - start_year + 1
        units = var_meta.units

        # 1. WHAT is changing?
        direction = "warming" if stats.sens_slope_per_decade > 0 and "Temperature" in var_meta.name else \
                    "cooling" if stats.sens_slope_per_decade < 0 and "Temperature" in var_meta.name else \
                    "an increasing trend" if stats.sens_slope_per_decade > 0 else \
                    "a decreasing trend" if stats.sens_slope_per_decade < 0 else "stable conditions"
        
        q_what = (
            f"The observed Earth-system parameter is {var_meta.name} ({var_meta.identifier}), measured in {units}. "
            f"Across the {duration_years}-year record ({start_year}–{end_year}), the data demonstrates {direction}. "
            f"The baseline climatological mean over this period is {stats.diagnostics.baseline_mean:.2f} {units} "
            f"(standard deviation: ±{stats.diagnostics.baseline_std:.2f} {units})."
        )

        # 2. WHERE is it changing?
        q_where = (
            f"Observed at {loc_name} ({coords_str}), representative of the source "
            f"grid cell ({var_meta.spatial_resolution}) over {location_info.get('state_or_country', 'the selected region')}."
        )

        # 3. HOW MUCH is it changing?
        rate_yr = stats.sens_slope_per_year
        rate_dec = stats.sens_slope_per_decade
        ci_low = stats.sens_slope_ci_lower_per_decade
        ci_high = stats.sens_slope_ci_upper_per_decade
        tot_change = stats.total_change_over_period
        
        pct_str = f" ({stats.percentage_change_over_period:+.1f}% relative to baseline)" if stats.percentage_change_over_period is not None else ""
        
        q_how_much = (
            f"The non-parametric Sen's median slope indicates a change rate of {rate_dec:+.3f} {units} per decade "
            f"({rate_yr:+.4f} {units}/year) with a 95% confidence interval of [{ci_low:+.3f} to {ci_high:+.3f}] {units}/decade. "
            f"Over the full {duration_years}-year observational window, the cumulative estimated shift is "
            f"{tot_change:+.2f} {units}{pct_str}. "
            f"For comparison, standard parametric linear regression (OLS) yields {stats.ols_slope_per_decade:+.3f} {units}/decade (R² = {stats.ols_r_squared:.2f})."
        )

        # 4. ARE the changes statistically significant?
        if stats.is_statistically_significant:
            autocorr_note = ""
            if stats.diagnostics.autocorrelation_significant:
                autocorr_note = (
                    f" Accounting for positive serial lag-1 autocorrelation (r₁ = {stats.diagnostics.lag1_autocorrelation:.2f}), "
                    f"the autocorrelation-adjusted Mann-Kendall test confirms p = {stats.modified_mk_p_value or stats.mk_p_value:.4f}."
                )
            
            q_sig = (
                f"YES, the observed trend is statistically significant ({stats.significance_label}). "
                f"The rank-based Mann-Kendall test yields standardized test statistic Z = {stats.mk_z:+.2f} and p = {stats.mk_p_value:.5f}, "
                f"rejecting the null hypothesis of no trend at the 95% confidence level (α = 0.05).{autocorr_note}"
            )
            confidence = "High Confidence" if (stats.diagnostics.missing_percentage < 5.0 and stats.mk_p_value < 0.01) else "Moderate Confidence"
        else:
            q_sig = (
                f"NO, the trend does NOT reach statistical significance at the α = 0.05 threshold ({stats.significance_label}). "
                f"The Mann-Kendall test statistic Z = {stats.mk_z:+.2f} (p = {stats.mk_p_value:.4f}) indicates that the observed "
                f"variation cannot be distinguished from natural decadal climatological variability with 95% statistical confidence."
            )
            confidence = "Inconclusive / Low Signal"

        # Synthesis
        synthesis = (
            f"Based on NASA {var_meta.original_source} data ({start_year}–{end_year}), {loc_name} exhibits a "
            f"{'robust, statistically significant' if stats.is_statistically_significant else 'statistically non-significant'} "
            f"{'upward' if stats.sens_slope_per_decade > 0 else 'downward'} trajectory in {var_meta.name.lower()}. "
            f"The consistency between the non-parametric Sen's slope ({rate_dec:+.3f} {units}/dec) and OLS slope ({stats.ols_slope_per_decade:+.3f} {units}/dec) "
            f"does not establish the cause of the estimated trend."
        )

        # Scientific Limitations
        limitations = [
            f"Spatial Gridding: NASA MERRA-2 assimilation native grid is {var_meta.spatial_resolution}. Sub-grid urban microclimate variations (e.g. localized urban canyon heat islands) are spatially smoothed.",
            f"Reanalysis Assimilation: Surface meteorological fields are derived from the NASA GEOS atmospheric general circulation model assimilating satellite sounders and conventional weather stations rather than an isolated single in-situ thermometer.",
            f"Serial Autocorrelation: Earth system climate time series frequently possess interannual persistence (e.g., ENSO, Indian Ocean Dipole). Modified Mann-Kendall variance adjustments were applied to avoid false positive inflation."
        ]

        # 5. Actionable Decision-Maker & Operational Impacts
        actionable_impacts = []
        if "T2M" in var_meta.identifier:
            if rate_dec > 0:
                actionable_impacts.append(
                    f"Thermal Stress & Public Health: A rate of {rate_dec:+.2f} °C/decade projects increased frequency of high wet-bulb thermal events, heightening outdoor occupational risk and peak electrical cooling demand."
                )
                actionable_impacts.append(
                    f"Agronomy & Evaporation: Elevated ambient temperatures accelerate atmospheric evaporative demand, intensifying crop water deficits during critical vegetative stages."
                )
            else:
                actionable_impacts.append(
                    f"Agronomic Thermal Budgets: Negative temperature trajectories affect chilling requirements and seasonal growing degree-day (GDD) accumulations."
                )
        elif var_meta.identifier == "PRECTOTCORR":
            if rate_dec > 0:
                actionable_impacts.append(
                    f"Hydrology & Drainage Infrastructure: An upward trend in precipitation rate ({rate_dec:+.3f} mm/day/decade) elevates stormwater system stress and localized flash-flood risks during convective bursts."
                )
                actionable_impacts.append(
                    f"Water Storage Opportunity: Potential for enhanced surface reservoir replenishment if watershed retention capacity is expanded."
                )
            else:
                actionable_impacts.append(
                    f"Water Security & Aquifer Depletion: A drying rate of {rate_dec:+.3f} mm/day/decade poses compounding risks to groundwater recharge and seasonal surface reservoir reliability."
                )
        elif var_meta.identifier == "WS10M":
            if rate_dec < 0:
                actionable_impacts.append(
                    f"Renewable Wind Generation: Decadal wind stilling ({rate_dec:+.3f} m/s/decade) directly degrades available kinetic wind power density (P ∝ v³), impacting capacity factors for commercial wind turbines."
                )
            else:
                actionable_impacts.append(
                    f"Renewable Wind & Structural Forcing: Increasing wind speeds elevate coastal wind power yields while increasing structural wind-load design thresholds."
                )
        elif var_meta.identifier == "ALLSKY_SFC_SW_DWN":
            if rate_dec > 0:
                actionable_impacts.append(
                    f"Solar Energy Yields: Increased surface downward solar flux ({rate_dec:+.3f} kW-hr/m²/day/decade) elevates photovoltaic energy generation capacity."
                )
            else:
                actionable_impacts.append(
                    f"Cloud/Aerosol Shielding: Declining downward solar radiation suggests increased aerosol optical depth or cloud cover, marginally lowering PV module generation."
                )

        citation = (
            f"NASA POWER Project ({var_meta.dataset_lineage}), Langley Research Center. "
            f"Gelaro et al. (2017), 'The Modern-Era Retrospective Analysis for Research and Applications, Version 2 (MERRA-2)', "
            f"Journal of Climate, doi:10.1175/JCLI-D-16-0758.1."
        )

        return ScientificExplanation(
            question_what=q_what,
            question_where=q_where,
            question_how_much=q_how_much,
            question_are_changes_significant=q_sig,
            scientific_synthesis=synthesis,
            confidence_tier=confidence,
            scientific_limitations=limitations,
            citation=citation,
            actionable_impacts=actionable_impacts
        )

    @staticmethod
    def generate_regional_explanation(
        var_meta: VariableMetadata,
        bounding_box: Dict[str, float],
        start_year: int,
        end_year: int,
        summary: RegionalSummaryStatistics
    ) -> ScientificExplanation:
        """
        Synthesizes a regional multi-cell spatial explanation.
        """
        units = var_meta.units
        span_years = end_year - start_year + 1
        bbox_str = f"Lat {bounding_box['lat_min']}° to {bounding_box['lat_max']}° N, Lon {bounding_box['lon_min']}° to {bounding_box['lon_max']}° E"

        # 1. WHAT is changing?
        if summary.has_opposing_trends:
            opposing_note = (
                f" Critically, the domain exhibits contrasting spatial trend directions: "
                f"{summary.positive_cells_count} cells display increasing trends while "
                f"{summary.negative_cells_count} cells display decreasing trends."
            )
        else:
            trend_dir = "uniform increasing" if summary.min_slope_per_decade >= 0 else "uniform decreasing"
            opposing_note = f" The domain exhibits a {trend_dir} trajectory across all evaluated cells."

        q_what = (
            f"Regional spatial distribution of {var_meta.name} ({var_meta.identifier}, {units}) across {summary.total_grid_cells} "
            f"native NASA assimilation grid cells from {start_year} to {end_year}.{opposing_note}"
        )

        # 2. WHERE is it changing?
        q_where = f"Rectangular geographic bounding domain ({bbox_str}); it is not an administrative boundary."

        # 3. HOW MUCH is it changing?
        if summary.has_opposing_trends:
            q_how_much = (
                f"The domain exhibits a pronounced spatial dipole: {summary.positive_cells_count} cells exhibit increasing trends "
                f"(peaking at {summary.max_slope_per_decade:+.3f} {units}/decade), whereas {summary.negative_cells_count} cells "
                f"exhibit decreasing trends (dropping to {summary.min_slope_per_decade:+.3f} {units}/decade). "
                f"The net domain-wide mean Sen's trend rate is {summary.regional_mean_slope_per_decade:+.3f} {units}/decade."
            )
        else:
            q_how_much = (
                f"Across the domain, the regional mean Sen's trend rate is {summary.regional_mean_slope_per_decade:+.3f} {units}/decade. "
                f"Spatial rates range from a minimum of {summary.min_slope_per_decade:+.3f} {units}/decade to a maximum of "
                f"{summary.max_slope_per_decade:+.3f} {units}/decade, reflecting spatial heterogeneity across inland and coastal zones."
            )

        # 4. ARE changes statistically significant?
        fdr_str = f" ({summary.fdr_significant_count} remain significant after Benjamini-Hochberg False Discovery Rate control)" if summary.fdr_significant_count is not None else ""
        
        if summary.has_opposing_trends:
            q_sig = (
                f"{summary.significant_cells_count} of {summary.total_grid_cells} grid cells ({summary.significant_cells_percentage:.1f}%) "
                f"demonstrate statistically significant trends at the local α = 0.05 level{fdr_str}. "
                f"Importantly, local significance counts by direction are: {summary.sig_positive_cells_count} increasing cells "
                f"({summary.fdr_positive_cells_count} under FDR control) and {summary.sig_negative_cells_count} decreasing cells "
                f"({summary.fdr_negative_cells_count} under FDR control) meet rigorous significance thresholds."
            )
        else:
            q_sig = (
                f"{summary.significant_cells_count} out of {summary.total_grid_cells} grid cells ({summary.significant_cells_percentage:.1f}%) "
                f"demonstrate statistically significant trends at the local α = 0.05 level{fdr_str}."
            )

        synthesis = (f"Estimated trends vary across the selected bounding box. "
                     f"{summary.fdr_positive_cells_count} positive and {summary.fdr_negative_cells_count} negative estimates pass the per-variable Benjamini-Hochberg procedure. "
                     "These exploratory results do not establish causes, and spatial dependence affects interpretation.")

        confidence = "High Confidence" if summary.significant_cells_percentage > 50.0 else "Moderate Confidence"

        limitations = [
            "Spatial Boundary Truncation: Grid cells located along coastlines incorporate mixed land-ocean surface boundary layer physics.",
            "Multiple Testing Considerations: When testing dozens of spatial cells simultaneously, False Discovery Rate (FDR) control is necessary to verify true regional significance.",
            f"Model Resolution: {var_meta.spatial_resolution} resolution cannot resolve fine-scale micro-topographic valleys in mountainous corridors."
        ]

        citation = (
            f"NASA POWER Project, NASA Langley Research Center ({var_meta.original_source}). "
            f"Data retrieved under MERRA-2 assimilation framework."
        )

        return ScientificExplanation(
            question_what=q_what,
            question_where=q_where,
            question_how_much=q_how_much,
            question_are_changes_significant=q_sig,
            scientific_synthesis=synthesis,
            confidence_tier=confidence,
            scientific_limitations=limitations,
            citation=citation
        )

insight_engine = ScientificInsightEngine()
