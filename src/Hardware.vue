<template>
    <div class="columns">
        <div class="column is-size-7">
            <h1 class="title">Hardware Manager</h1>

            <!-- Import/Export Section -->
            <div class="mb-4">
                <h2 class="subtitle">Import/Export</h2>
                <div class="field is-grouped">
                    <div class="control">
                        <button
                            class="button is-small is-info"
                            @click="exportData"
                        >
                            📤 Export Hardware Data
                        </button>
                    </div>
                    <div class="control">
                        <label class="button is-small is-success">
                            📥 Import Hardware Data
                            <input
                                type="file"
                                accept=".json"
                                @change="importData"
                                style="display: none"
                                ref="fileInput"
                            />
                        </label>
                    </div>
                </div>
                <p class="has-text-grey is-size-7 mt-2">
                    💡 Export your hardware data to backup or share with other
                    devices. Import will merge with existing data.
                </p>
            </div>

            <!-- Spherometers Section -->
            <div class="">
                <h2 class="subtitle">Spherometers</h2>

                <!-- Add/Edit Spherometer Form -->
                <div class="field is-grouped">
                    <div class="control">
                        <input
                            class="input is-small"
                            type="text"
                            placeholder="Name"
                            v-model="newSpherometer.name"
                        />
                    </div>
                </div>
                <div class="field is-grouped">
                    <div class="control">
                        <input
                            class="input is-small"
                            type="number"
                            step="0.01"
                            placeholder="Feet radius (mm)"
                            v-model.number="newSpherometer.feetRadius"
                        />
                    </div>
                </div>
                <div class="field is-grouped">
                    <div class="control">
                        <input
                            class="input is-small"
                            type="number"
                            step="0.01"
                            placeholder="Ball diameter (mm)"
                            v-model.number="newSpherometer.ballRadius2"
                        />
                    </div>
                    <div class="control">
                        <button
                            class="button is-small is-primary"
                            @click="addSpherometer"
                            :disabled="!isSpherometerValid"
                        >
                            {{
                                editingSpherometerIndex !== null
                                    ? "Update"
                                    : "Add"
                            }}
                        </button>
                        <button
                            v-if="editingSpherometerIndex !== null"
                            class="button is-small ml-2"
                            @click="cancelEditSpherometer"
                        >
                            &times;
                        </button>
                    </div>
                </div>

                <!-- Spherometers List -->
                <table
                    class="table is-small is-size-7 is-fullwidth mt-4"
                    v-if="spherometers.length > 0"
                >
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Feet R (mm)</th>
                            <th>Ball D (mm)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(spherometer, index) in spherometers"
                            :key="index"
                        >
                            <td>{{ spherometer.name }}</td>
                            <td>{{ spherometer.feetRadius }}</td>
                            <td>{{ spherometer.ballRadius2 }}</td>
                            <td>
                                <button
                                    class="button is-small is-info m-1"
                                    @click="editSpherometer(index)"
                                >
                                    Edit
                                </button>
                                <button
                                    class="button is-small is-danger m-1"
                                    @click="deleteSpherometer(index)"
                                >
                                    &times;
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-else class="has-text-grey">No spherometers added yet.</p>
            </div>

            <!-- Optical Pieces Section -->
            <div class="mt-5">
                <h2 class="subtitle">Optical Pieces</h2>

                <!-- Add/Edit Optical Piece Form -->
                <div class="field is-grouped">
                    <div class="control">
                        <input
                            class="input is-small"
                            type="text"
                            placeholder="Name"
                            v-model="newOpticalPiece.name"
                        />
                    </div>
                </div>
                <div class="field is-grouped">
                    <div class="control">
                        <input
                            class="input is-small"
                            type="number"
                            step="0.01"
                            placeholder="Radius (mm)"
                            v-model.number="newOpticalPiece.radius"
                        />
                    </div>
                </div>
                <div class="field is-grouped">
                    <div class="control">
                        <input
                            class="input is-small"
                            type="number"
                            step="0.01"
                            placeholder="Radius of Curvature (mm)"
                            v-model.number="newOpticalPiece.radiusOfCurvature"
                        />
                    </div>
                    <div class="control">
                        <button
                            class="button is-small is-primary"
                            @click="addOpticalPiece"
                            :disabled="!isOpticalPieceValid"
                        >
                            {{
                                editingOpticalPieceIndex !== null
                                    ? "Update"
                                    : "Add"
                            }}
                        </button>
                        <button
                            v-if="editingOpticalPieceIndex !== null"
                            class="button is-small ml-2"
                            @click="cancelEditOpticalPiece"
                        >
                            &times;
                        </button>
                    </div>
                </div>

                <!-- Optical Pieces List -->
                <table
                    class="table is-small is-fullwidth mt-4"
                    v-if="opticalPieces.length > 0"
                >
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>R (mm)</th>
                            <th>RoC (mm)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(piece, index) in opticalPieces"
                            :key="index"
                        >
                            <td>{{ piece.name }}</td>
                            <td>{{ piece.radius }}</td>
                            <td>{{ piece.radiusOfCurvature }}</td>
                            <td class="">
                                <button
                                    class="button is-small is-info m-1"
                                    @click="editOpticalPiece(index)"
                                >
                                    Edit
                                </button>
                                <button
                                    class="button is-small is-danger m-1"
                                    @click="deleteOpticalPiece(index)"
                                >
                                    &times;
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-else class="has-text-grey">No optical pieces added yet.</p>
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
