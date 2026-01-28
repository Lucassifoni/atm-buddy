<template>
  <div class="space-y-6">
    <div class="text-sm">
      <div class="card-title justify-center mb-3">
        <div class="badge badge-outline badge-sm">
          {{ $t("hardware.title") }}
        </div>
      </div>

      <div class="card bg-base-200 p-3 mb-3">
        <h2 class="text-sm font-semibold mb-2">
          {{ $t("hardware.importExport") }}
        </h2>
        <div class="flex gap-1 flex-wrap">
          <button class="btn btn-info btn-xs" @click="exportData">
            {{ $t("hardware.exportBtn") }}
          </button>
          <label class="btn btn-success btn-xs">
            {{ $t("hardware.importBtn") }}
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
          {{ $t("hardware.exportHelp") }}
        </p>
      </div>

      <div class="card bg-base-200 p-3 mb-3">
        <h2 class="text-sm font-semibold mb-2">
          {{ $t("hardware.spherometers") }}
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 mb-2">
          <input
            class="input input-bordered input-sm"
            type="text"
            :placeholder="$t('common.name')"
            v-model="newSpherometer.name"
          />
          <input
            class="input input-bordered input-sm"
            inputmode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
            :placeholder="`${$t('hardware.feetRadius')} (${lengthUnit})`"
            v-model.number="newSpherometer.feetRadius"
          />
          <input
            class="input input-bordered input-sm"
            inputmode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
            :placeholder="`${$t('hardware.ballDiameter')} (${lengthUnit})`"
            v-model.number="newSpherometer.ballRadius2"
          />
          <div class="flex gap-1">
            <button
              class="btn btn-primary btn-xs flex-1"
              @click="addSpherometer"
              :disabled="!isSpherometerValid"
            >
              {{
                editingSpherometerIndex !== null
                  ? $t("common.update")
                  : $t("common.add")
              }}
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

        <div class="overflow-x-auto" v-if="spherometers.length > 0">
          <table class="table table-xs w-full">
            <thead>
              <tr>
                <th class="text-xs">{{ $t("common.name") }}</th>
                <th class="text-xs">
                  {{ $t("hardware.feetR") }} ({{ lengthUnit }})
                </th>
                <th class="text-xs">
                  {{ $t("hardware.ballD") }} ({{ lengthUnit }})
                </th>
                <th class="text-xs">{{ $t("common.actions") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(spherometer, index) in spherometers" :key="index">
                <td class="text-xs">{{ spherometer.name }}</td>
                <td class="text-xs">
                  {{ formatLength(spherometer.feetRadius) }}
                </td>
                <td class="text-xs">
                  {{ formatLength(spherometer.ballRadius2) }}
                </td>
                <td>
                  <button
                    class="btn btn-info btn-xs mr-1"
                    @click="editSpherometer(index)"
                  >
                    {{ $t("common.edit") }}
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
        <p v-else class="text-gray-500 text-xs">
          {{ $t("hardware.noSpherometers") }}
        </p>
      </div>

      <div class="card bg-base-200 p-3 mb-3">
        <h2 class="text-sm font-semibold mb-2">
          {{ $t("hardware.opticalPieces") }}
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 mb-2">
          <input
            class="input input-bordered input-sm"
            type="text"
            :placeholder="$t('common.name')"
            v-model="newOpticalPiece.name"
          />
          <input
            class="input input-bordered input-sm"
            inputmode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
            :placeholder="`${$t('hardware.radius')} (${lengthUnit})`"
            v-model.number="newOpticalPiece.radius"
          />
          <input
            class="input input-bordered input-sm"
            inputmode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
            :placeholder="`${$t('hardware.roc')} (${lengthUnit})`"
            v-model.number="newOpticalPiece.radiusOfCurvature"
          />
          <div class="flex gap-1">
            <button
              class="btn btn-primary btn-xs flex-1"
              @click="addOpticalPiece"
              :disabled="!isOpticalPieceValid"
            >
              {{
                editingOpticalPieceIndex !== null
                  ? $t("common.update")
                  : $t("common.add")
              }}
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

        <div class="overflow-x-auto" v-if="opticalPieces.length > 0">
          <table class="table table-xs w-full">
            <thead>
              <tr>
                <th class="text-xs">{{ $t("common.name") }}</th>
                <th class="text-xs">
                  {{ $t("hardware.r") }} ({{ lengthUnit }})
                </th>
                <th class="text-xs">
                  {{ $t("hardware.rocShort") }} ({{ lengthUnit }})
                </th>
                <th class="text-xs">{{ $t("common.actions") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(piece, index) in opticalPieces" :key="index">
                <td class="text-xs">{{ piece.name }}</td>
                <td class="text-xs">{{ formatLength(piece.radius) }}</td>
                <td class="text-xs">
                  {{ formatLength(piece.radiusOfCurvature) }}
                </td>
                <td>
                  <button
                    class="btn btn-info btn-xs mr-1"
                    @click="editOpticalPiece(index)"
                  >
                    {{ $t("common.edit") }}
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
        <p v-else class="text-gray-500 text-xs">
          {{ $t("hardware.noOpticalPieces") }}
        </p>
      </div>

      <div class="card bg-base-200 p-3">
        <h2 class="text-sm font-semibold mb-2">
          {{ $t("hardware.polishers") }}
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 mb-2">
          <input
            class="input input-bordered input-sm"
            type="text"
            :placeholder="$t('common.name')"
            v-model="newPolisher.name"
          />
          <input
            class="input input-bordered input-sm"
            inputmode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
            :placeholder="`${$t('hardware.diameter')} (${lengthUnit})`"
            v-model.number="newPolisher.diameter"
          />
          <input
            class="input input-bordered input-sm"
            inputmode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
            :placeholder="`${$t('hardware.weight')} (${massUnit})`"
            v-model.number="newPolisher.weight"
          />
          <div class="flex gap-1">
            <button
              class="btn btn-primary btn-xs flex-1"
              @click="addPolisher"
              :disabled="!isPolisherValid"
            >
              {{
                editingPolisherIndex !== null
                  ? $t("common.update")
                  : $t("common.add")
              }}
            </button>
            <button
              v-if="editingPolisherIndex !== null"
              class="btn btn-outline btn-xs"
              @click="cancelEditPolisher"
            >
              ×
            </button>
          </div>
        </div>

        <div class="overflow-x-auto" v-if="polishers.length > 0">
          <table class="table table-xs w-full">
            <thead>
              <tr>
                <th class="text-xs">{{ $t("common.name") }}</th>
                <th class="text-xs">
                  {{ $t("hardware.diameter") }} ({{ lengthUnit }})
                </th>
                <th class="text-xs">
                  {{ $t("hardware.weight") }} ({{ massUnit }})
                </th>
                <th class="text-xs">{{ $t("common.actions") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(polisher, index) in polishers" :key="index">
                <td class="text-xs">{{ polisher.name }}</td>
                <td class="text-xs">
                  {{ formatLength(polisher.diameter) }}
                </td>
                <td class="text-xs">
                  {{ formatMass(polisher.weight) }}
                </td>
                <td>
                  <button
                    class="btn btn-info btn-xs mr-1"
                    @click="editPolisher(index)"
                  >
                    {{ $t("common.edit") }}
                  </button>
                  <button
                    class="btn btn-error btn-xs"
                    @click="deletePolisher(index)"
                  >
                    ×
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-gray-500 text-xs">
          {{ $t("hardware.noPolishers") }}
        </p>
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
      polishers: [],
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
      newPolisher: {
        name: "",
        diameter: null,
        weight: null,
      },
      editingSpherometerIndex: null,
      editingOpticalPieceIndex: null,
      editingPolisherIndex: null,
    };
  },
  computed: {
    lengthUnit() {
      return this.$units.convert.lengthUnit();
    },
    massUnit() {
      return this.$units.convert.massUnit();
    },
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
    isPolisherValid() {
      return (
        this.newPolisher.name &&
        this.newPolisher.diameter > 0 &&
        this.newPolisher.weight > 0
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
      this.polishers = utils.get("__hardware", "polishers", []);
    },
    saveData() {
      const storage = utils.getHardware();
      storage.spherometers = this.spherometers;
      storage.opticalPieces = this.opticalPieces;
      storage.polishers = this.polishers;
      if (typeof window !== "undefined") {
        localStorage.setItem("__hardware", JSON.stringify(storage));
      }
    },
    formatLength(mm) {
      return this.$units.convert.formatLength(mm);
    },
    formatMass(g) {
      return this.$units.convert.formatMass(g);
    },
    addSpherometer() {
      if (!this.isSpherometerValid) return;

      const spherometer = {
        name: this.newSpherometer.name,
        feetRadius: this.$units.convert.lengthFromDisplay(
          this.newSpherometer.feetRadius,
        ),
        ballRadius2: this.$units.convert.lengthFromDisplay(
          this.newSpherometer.ballRadius2,
        ),
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
      this.newSpherometer = {
        name: spherometer.name,
        feetRadius: this.$units.convert.lengthToDisplay(spherometer.feetRadius),
        ballRadius2: this.$units.convert.lengthToDisplay(
          spherometer.ballRadius2,
        ),
      };
      this.editingSpherometerIndex = index;
    },
    deleteSpherometer(index) {
      if (confirm(this.$t("hardware.confirmDeleteSpherometer"))) {
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
        radius: this.$units.convert.lengthFromDisplay(
          this.newOpticalPiece.radius,
        ),
        radiusOfCurvature: this.$units.convert.lengthFromDisplay(
          this.newOpticalPiece.radiusOfCurvature,
        ),
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
      this.newOpticalPiece = {
        name: piece.name,
        radius: this.$units.convert.lengthToDisplay(piece.radius),
        radiusOfCurvature: this.$units.convert.lengthToDisplay(
          piece.radiusOfCurvature,
        ),
      };
      this.editingOpticalPieceIndex = index;
    },
    deleteOpticalPiece(index) {
      if (confirm(this.$t("hardware.confirmDeleteOpticalPiece"))) {
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
    addPolisher() {
      if (!this.isPolisherValid) return;

      const polisher = {
        name: this.newPolisher.name,
        diameter: this.$units.convert.lengthFromDisplay(
          this.newPolisher.diameter,
        ),
        weight: this.$units.convert.massFromDisplay(this.newPolisher.weight),
      };

      if (this.editingPolisherIndex !== null) {
        this.polishers[this.editingPolisherIndex] = polisher;
        this.editingPolisherIndex = null;
      } else {
        this.polishers.push(polisher);
      }

      this.saveData();
      this.resetPolisherForm();
    },
    editPolisher(index) {
      const polisher = this.polishers[index];
      this.newPolisher = {
        name: polisher.name,
        diameter: this.$units.convert.lengthToDisplay(polisher.diameter),
        weight: this.$units.convert.massToDisplay(polisher.weight),
      };
      this.editingPolisherIndex = index;
    },
    deletePolisher(index) {
      if (confirm(this.$t("hardware.confirmDeletePolisher"))) {
        this.polishers.splice(index, 1);
        this.saveData();
      }
    },
    cancelEditPolisher() {
      this.editingPolisherIndex = null;
      this.resetPolisherForm();
    },
    resetPolisherForm() {
      this.newPolisher = {
        name: "",
        diameter: null,
        weight: null,
      };
    },
    exportData() {
      const data = {
        spherometers: this.spherometers,
        opticalPieces: this.opticalPieces,
        polishers: this.polishers,
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
            alert(this.$t("hardware.invalidFile"));
            return;
          }

          const importedSpherometers = data.spherometers || [];
          const importedOpticalPieces = data.opticalPieces || [];
          const importedPolishers = data.polishers || [];

          importedSpherometers.forEach((imported) => {
            const existing = this.spherometers.find(
              (s) => s.name === imported.name,
            );
            if (existing) {
              if (
                confirm(
                  `${this.$t("hardware.spherometerWord")} "${imported.name}" ${this.$t("hardware.confirmReplace")}`,
                )
              ) {
                const index = this.spherometers.indexOf(existing);
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
                  `${this.$t("hardware.opticalPieceWord")} "${imported.name}" ${this.$t("hardware.confirmReplace")}`,
                )
              ) {
                const index = this.opticalPieces.indexOf(existing);
                this.opticalPieces[index] = imported;
              }
            } else {
              this.opticalPieces.push(imported);
            }
          });

          importedPolishers.forEach((imported) => {
            const existing = this.polishers.find(
              (p) => p.name === imported.name,
            );
            if (existing) {
              if (
                confirm(
                  `${this.$t("hardware.polisherWord")} "${imported.name}" ${this.$t("hardware.confirmReplace")}`,
                )
              ) {
                const index = this.polishers.indexOf(existing);
                this.polishers[index] = imported;
              }
            } else {
              this.polishers.push(imported);
            }
          });

          this.saveData();
          alert(
            this.$t("hardware.importSuccess", {
              spherometers: importedSpherometers.length,
              opticalPieces: importedOpticalPieces.length,
              polishers: importedPolishers.length,
            }),
          );
        } catch (error) {
          alert(this.$t("hardware.importError"));
        }

        this.$refs.fileInput.value = "";
      };
      reader.readAsText(file);
    },
    validateImportData(data) {
      if (typeof data !== "object" || data === null) return false;

      if (
        !Array.isArray(data.spherometers) &&
        !Array.isArray(data.opticalPieces) &&
        !Array.isArray(data.polishers)
      ) {
        return false;
      }

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

      if (data.polishers) {
        for (const polisher of data.polishers) {
          if (
            !polisher.name ||
            typeof polisher.diameter !== "number" ||
            typeof polisher.weight !== "number"
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
