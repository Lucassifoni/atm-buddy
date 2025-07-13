<template>
    <div class="columns">
        <div class="column is-size-7">
            <h1 class="title">Hardware Manager</h1>

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
                            placeholder="Ball radius (mm)"
                            v-model.number="newSpherometer.ballRadius"
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
                            <th>Ball R (mm)</th>
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
                            <td>{{ spherometer.ballRadius }}</td>
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
                ballRadius: null,
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
                this.newSpherometer.ballRadius > 0
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
                ballRadius: this.newSpherometer.ballRadius,
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
                ballRadius: null,
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
    },
};
</script>
