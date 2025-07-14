<template>
    <div class="space-y-6">
        <div class="text-sm">
            <div class="card-title justify-center mb-3">
                <div class="badge badge-outline badge-sm">Hardware Manager</div>
            </div>

            <!-- Import/Export Section -->
            <div class="card bg-base-200 p-3 mb-3">
                <h2 class="text-sm font-semibold mb-2">Import/Export</h2>
                <div class="flex gap-1 flex-wrap">
                    <button
                        class="btn btn-info btn-xs"
                        @click="exportData"
                    >
                        📤 Export
                    </button>
                    <label class="btn btn-success btn-xs">
                        📥 Import
                        <input
                            type="file"
                            accept=".json"
                            @change="importData"
                            style="display: none"
                            ref="fileInput"
                        />
                    </label>
                </div>
                <p class="text-gray-500 text-xs mt-1">
                    💡 Export your hardware data to backup or share with other devices. Import will merge with existing data.
                </p>
            </div>

            <!-- Spherometers Section -->
            <div class="card bg-base-200 p-3">
                <h2 class="text-sm font-semibold mb-2">Spherometers</h2>

                <!-- Add/Edit Spherometer Form -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 mb-2">
                    <input
                        class="input input-bordered input-sm"
                        type="text"
                        placeholder="Name"
                        v-model="newSpherometer.name"
                    />
                    <input
                        class="input input-bordered input-sm"
                        type="number"
                        step="0.01"
                        placeholder="Feet radius (mm)"
                        v-model.number="newSpherometer.feetRadius"
                    />
                    <input
                        class="input input-bordered input-sm"
                        type="number"
                        step="0.01"
                        placeholder="Ball diameter (mm)"
                        v-model.number="newSpherometer.ballRadius2"
                    />
                    <div class="flex gap-1">
                        <button
                            class="btn btn-primary btn-xs flex-1"
                            @click="addSpherometer"
                            :disabled="!isSpherometerValid"
                        >
                            {{ editingSpherometerIndex !== null ? "Update" : "Add" }}
                        </button>
                        <button
                            v-if="editingSpherometerIndex !== null"
                            class="btn btn-outline btn-xs"
                            @click="cancelEditSpherometer"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <!-- Spherometers List -->
                <div class="overflow-x-auto" v-if="spherometers.length > 0">
                    <table class="table table-xs w-full">
                        <thead>
                            <tr>
                                <th class="text-xs">Name</th>
                                <th class="text-xs">Feet R (mm)</th>
                                <th class="text-xs">Ball D (mm)</th>
                                <th class="text-xs">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(spherometer, index) in spherometers"
                                :key="index"
                            >
                                <td class="text-xs">{{ spherometer.name }}</td>
                                <td class="text-xs">{{ spherometer.feetRadius }}</td>
                                <td class="text-xs">{{ spherometer.ballRadius2 }}</td>
                                <td>
                                    <button
                                        class="btn btn-info btn-xs mr-1"
                                        @click="editSpherometer(index)"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        class="btn btn-error btn-xs"
                                        @click="deleteSpherometer(index)"
                                    >
                                        ×
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p v-else class="text-gray-500 text-xs">No spherometers added yet.</p>
            </div>

            <!-- Optical Pieces Section -->
            <div class="card bg-base-200 p-3">
                <h2 class="text-sm font-semibold mb-2">Optical Pieces</h2>

                <!-- Add/Edit Optical Piece Form -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 mb-2">
                    <input
                        class="input input-bordered input-sm"
                        type="text"
                        placeholder="Name"
                        v-model="newOpticalPiece.name"
                    />
                    <input
                        class="input input-bordered input-sm"
                        type="number"
                        step="0.01"
                        placeholder="Radius (mm)"
                        v-model.number="newOpticalPiece.radius"
                    />
                    <input
                        class="input input-bordered input-sm"
                        type="number"
                        step="0.01"
                        placeholder="ROC (mm)"
                        v-model.number="newOpticalPiece.radiusOfCurvature"
                    />
                    <div class="flex gap-1">
                        <button
                            class="btn btn-primary btn-xs flex-1"
                            @click="addOpticalPiece"
                            :disabled="!isOpticalPieceValid"
                        >
                            {{ editingOpticalPieceIndex !== null ? "Update" : "Add" }}
                        </button>
                        <button
                            v-if="editingOpticalPieceIndex !== null"
                            class="btn btn-outline btn-xs"
                            @click="cancelEditOpticalPiece"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <!-- Optical Pieces List -->
                <div class="overflow-x-auto" v-if="opticalPieces.length > 0">
                    <table class="table table-xs w-full">
                        <thead>
                            <tr>
                                <th class="text-xs">Name</th>
                                <th class="text-xs">R (mm)</th>
                                <th class="text-xs">RoC (mm)</th>
                                <th class="text-xs">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(piece, index) in opticalPieces"
                                :key="index"
                            >
                                <td class="text-xs">{{ piece.name }}</td>
                                <td class="text-xs">{{ piece.radius }}</td>
                                <td class="text-xs">{{ piece.radiusOfCurvature }}</td>
                                <td>
                                    <button
                                        class="btn btn-info btn-xs mr-1"
                                        @click="editOpticalPiece(index)"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        class="btn btn-error btn-xs"
                                        @click="deleteOpticalPiece(index)"
                                    >
                                        ×
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p v-else class="text-gray-500 text-xs">No optical pieces added yet.</p>
            </div>
        </div>
    </div>
</template>

<script>
import * as utils from "./utils.js";

export default {
    name: "Hardware",
    data() {
        return {
            spherometers: [],
            opticalPieces: [],
            newSpherometer: {
                name: "",
                feetRadius: null,
                ballRadius2: null,
            },
            newOpticalPiece: {
                name: "",
                radius: null,
                radiusOfCurvature: null,
            },
            editingSpherometerIndex: null,
            editingOpticalPieceIndex: null,
        };
    },
    computed: {
        isSpherometerValid() {
            return (
                this.newSpherometer.name &&
                this.newSpherometer.feetRadius > 0 &&
                this.newSpherometer.ballRadius2 > 0
            );
        },
        isOpticalPieceValid() {
            return (
                this.newOpticalPiece.name &&
                this.newOpticalPiece.radius > 0 &&
                this.newOpticalPiece.radiusOfCurvature > 0
            );
        },
    },
    mounted() {
        this.loadData();
    },
    methods: {
        loadData() {
            this.spherometers = utils.get("__hardware", "spherometers", []);
            this.opticalPieces = utils.get("__hardware", "opticalPieces", []);
        },
        saveData() {
            const storage = utils.get("__hardware", null, {});
            storage.spherometers = this.spherometers;
            storage.opticalPieces = this.opticalPieces;
            localStorage.setItem("__hardware", JSON.stringify(storage));
        },
        addSpherometer() {
            if (!this.isSpherometerValid) return;

            const spherometer = {
                name: this.newSpherometer.name,
                feetRadius: this.newSpherometer.feetRadius,
                ballRadius2: this.newSpherometer.ballRadius2,
            };

            if (this.editingSpherometerIndex !== null) {
                this.spherometers[this.editingSpherometerIndex] = spherometer;
                this.editingSpherometerIndex = null;
            } else {
                this.spherometers.push(spherometer);
            }

            this.saveData();
            this.resetSpherometerForm();
        },
        editSpherometer(index) {
            const spherometer = this.spherometers[index];
            this.newSpherometer = { ...spherometer };
            this.editingSpherometerIndex = index;
        },
        deleteSpherometer(index) {
            if (confirm("Are you sure you want to delete this spherometer?")) {
                this.spherometers.splice(index, 1);
                this.saveData();
            }
        },
        cancelEditSpherometer() {
            this.editingSpherometerIndex = null;
            this.resetSpherometerForm();
        },
        resetSpherometerForm() {
            this.newSpherometer = {
                name: "",
                feetRadius: null,
                ballRadius2: null,
            };
        },
        addOpticalPiece() {
            if (!this.isOpticalPieceValid) return;

            const piece = {
                name: this.newOpticalPiece.name,
                radius: this.newOpticalPiece.radius,
                radiusOfCurvature: this.newOpticalPiece.radiusOfCurvature,
            };

            if (this.editingOpticalPieceIndex !== null) {
                this.opticalPieces[this.editingOpticalPieceIndex] = piece;
                this.editingOpticalPieceIndex = null;
            } else {
                this.opticalPieces.push(piece);
            }

            this.saveData();
            this.resetOpticalPieceForm();
        },
        editOpticalPiece(index) {
            const piece = this.opticalPieces[index];
            this.newOpticalPiece = { ...piece };
            this.editingOpticalPieceIndex = index;
        },
        deleteOpticalPiece(index) {
            if (
                confirm("Are you sure you want to delete this optical piece?")
            ) {
                this.opticalPieces.splice(index, 1);
                this.saveData();
            }
        },
        cancelEditOpticalPiece() {
            this.editingOpticalPieceIndex = null;
            this.resetOpticalPieceForm();
        },
        resetOpticalPieceForm() {
            this.newOpticalPiece = {
                name: "",
                radius: null,
                radiusOfCurvature: null,
            };
        },
        exportData() {
            const data = {
                spherometers: this.spherometers,
                opticalPieces: this.opticalPieces,
                exportDate: new Date().toISOString(),
                version: "1.0",
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `atm-buddy-hardware-${new Date().toISOString().split("T")[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },
        importData(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);

                    if (!this.validateImportData(data)) {
                        alert(
                            "Invalid file format. Please select a valid ATM Buddy hardware export file.",
                        );
                        return;
                    }

                    // Merge imported data with existing data
                    const importedSpherometers = data.spherometers || [];
                    const importedOpticalPieces = data.opticalPieces || [];

                    // Check for duplicates and merge
                    importedSpherometers.forEach((imported) => {
                        const existing = this.spherometers.find(
                            (s) => s.name === imported.name,
                        );
                        if (existing) {
                            if (
                                confirm(
                                    `Spherometer "${imported.name}" already exists. Replace it?`,
                                )
                            ) {
                                const index =
                                    this.spherometers.indexOf(existing);
                                this.spherometers[index] = imported;
                            }
                        } else {
                            this.spherometers.push(imported);
                        }
                    });

                    importedOpticalPieces.forEach((imported) => {
                        const existing = this.opticalPieces.find(
                            (p) => p.name === imported.name,
                        );
                        if (existing) {
                            if (
                                confirm(
                                    `Optical piece "${imported.name}" already exists. Replace it?`,
                                )
                            ) {
                                const index =
                                    this.opticalPieces.indexOf(existing);
                                this.opticalPieces[index] = imported;
                            }
                        } else {
                            this.opticalPieces.push(imported);
                        }
                    });

                    this.saveData();
                    alert(
                        `Import completed! Added ${importedSpherometers.length} spherometers and ${importedOpticalPieces.length} optical pieces.`,
                    );
                } catch (error) {
                    alert(
                        "Error reading file. Please make sure it's a valid JSON file.",
                    );
                }

                // Reset file input
                this.$refs.fileInput.value = "";
            };
            reader.readAsText(file);
        },
        validateImportData(data) {
            if (typeof data !== "object" || data === null) return false;

            // Check if it has the expected structure
            if (
                !Array.isArray(data.spherometers) &&
                !Array.isArray(data.opticalPieces)
            ) {
                return false;
            }

            // Validate spherometers structure
            if (data.spherometers) {
                for (const spherometer of data.spherometers) {
                    if (
                        !spherometer.name ||
                        typeof spherometer.feetRadius !== "number" ||
                        typeof spherometer.ballRadius2 !== "number"
                    ) {
                        return false;
                    }
                }
            }

            // Validate optical pieces structure
            if (data.opticalPieces) {
                for (const piece of data.opticalPieces) {
                    if (
                        !piece.name ||
                        typeof piece.radius !== "number" ||
                        typeof piece.radiusOfCurvature !== "number"
                    ) {
                        return false;
                    }
                }
            }

            return true;
        },
    },
};
</script>
