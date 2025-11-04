package org.example.backend.model;

public enum UserPvConfig {
    CHEAP_PV_COMBI(2, 400, 800, 450, 1.00),
    MEDIUM_PV_COMBI(3, 400, 800, 600, 0.85),
    PREMIUM_PV_COMBI(4, 400, 800, 750, 0.80);

    private final int moduleCount;
    private final int moduleWatt;
    private final int inverterWatt;
    private final int installationCostEur;
    private final double clippingFactor;

    UserPvConfig(int moduleCount, int moduleWatt, int inverterWatt, int installationCostEur, double clippingFactor) {
        this.moduleCount = moduleCount;
        this.moduleWatt = moduleWatt;
        this.inverterWatt = inverterWatt;
        this.installationCostEur = installationCostEur;
        this.clippingFactor = clippingFactor;
    }

    public int getModuleCount() {
        return moduleCount;
    }

    public int getModuleWatt() {
        return moduleWatt;
    }

    public int getInverterWatt() {
        return inverterWatt;
    }

    public int getInstallationCostEur() {
        return installationCostEur;
    }

    public double getTotalModuleKwp() {
        return (moduleCount * moduleWatt) / 1000.0;
    }

    public double getOversizingRatio() {
        return (double) (moduleCount * moduleWatt) / inverterWatt;
    }

    public double getClippingFactor() {
        return clippingFactor;
    }
}
