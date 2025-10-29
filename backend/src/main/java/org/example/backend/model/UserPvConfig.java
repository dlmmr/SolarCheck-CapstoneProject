package org.example.backend.model;

public enum UserPvConfig {

    CHEAP_PV_COMBI(500, 0.8),
    MEDIUM_PV_COMBI(1000, 1.0),
    PREMIUM_PV_COMBI(2000, 2.0);

    private final int installationCostEur;
    private final double defaultPowerKwp;

    // Konstruktor
    UserPvConfig(int installationCostEur, double defaultPowerKwp) {
        this.installationCostEur = installationCostEur;
        this.defaultPowerKwp = defaultPowerKwp;
    }

    // Getter
    public int getInstallationCostEur() {
        return installationCostEur;
    }

    public double getDefaultPowerKwp() {
        return defaultPowerKwp;
    }
}
