import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CenteredModal from "./CenteredModal";

interface SearchComponentProps {
  setSelectedOptions: (selected: string[]) => void;
  setSelectedDataOutside: (data: {
    medication: string;
    dose: string;
    frequency: string;
  }[]) => void;
}


const options = [   
                          "ESCITALOPRAM 10 mg",
                "ESCITALOPRAM 15 mg",
                "FLUOXETINE 20 mg",
                "SERTRALINE 50 mg",
                "SERTRALINE 100 mg",
                "FLUVOXAMINE 100 mg",
                "PAROXETINE 20 mg",
                "PAROXETINE 25 mg",
                "CITALOPRAM 20 mg",
                "VORTIOXETINE 5 mg",
                "VORTIOXETINE 10 mg",
                "VORTIOETINE 20 mg",
                "VENLAFAXINE 37.5 mg",
                "VENLAFAXINE 75 mg",
                "VENLAFAXINE 150 mg",
                "DULOXETINE 30 mg",
                "DULOXETINE 60 mg",
                "BUPROPION 150 mg",
                "CLOMIPRAMINE 25 mg",
                "CLOMIPRAMINE 75 mg",
                "IMIPRAMINE 10 mg",
                "IMIPRAMINE 25 mg",
                "AMITRYPTILINE 10 mg",
                "AMITRYPTILINE 25 mg",
                "DOXEPIN 10 mg",
                "DOXEPINE 50 mg",
                "MIRTAZAPINE 30 mg",
                "RISPERIDONE 1 mg",
                "RISPERIDONE 2 mg",
                "RISPERIDONE 4 mg",
                "OLANZAPINE 5 mg",
                "OLANZAPINE 10 mg",
                "OLANZAPINE 20 mg",
                "QUETIAPINE 25 mg",
                "QUETIAPINE 50 mg",
                "QUETIAPINE 100 mg",
                "QUETIAPINE 300 mg",
                "QUETIAPINE 400 mg",
                "CLOZAPINE 100 mg",
                "CLOZAPINE 25 mg",
                "PALIPERIDONE 3 mg",
                "PALIPERIDONE 6 mg",
                "PALIPERIDONE 9 mg",
                "ARIPIPRAZOLE 5 mg",
                "ARIPIPRAZOLE 10 mg",
                "ARIPIPRAZOLE 15 mg",
                "ARIPIPRAZOLE 30 mg",
                "CARIPRAZINE 1.5 mg",
                "CARIPRAZINE 3 mg",
                "CARIPRAZINE 4.5 mg",
                "CARIPRAZINE 6 mg",
                "AMISULPRIDE 100 mg",
                "AMISULPRIDE 400 mg",
                "PIMOZIDE 4 mg",
                "HALDOL 5 mg",
                "PERPHENAZINE 8 mg",
                "CHLORPROMAZINE 100 mg",
                "CHLORPROMAZINE 25 mg",
                "PROMETHAZINE 25 mg",
                "ALPRAZOLAM 0.5 mg",
                "ALPRAZOLAM 2 mg",
                "LORAZEPAM 1 mg",
                "LORAZEPAM 2 mg",
                "CLONAZEPAM 0.5 mg",
                "CLONAZEPAM 2 mg",
                "DIAZEPAM 5 mg",
                "DIAZEPAM 10 mg",
                "BROMAZEPAM 1.5 mg",
                "BROMAZEPAM 3 mg",
                "BROMAZEPAM 6 mg",
                "ZOLPIDEM 10 mg",
                "ZOPICLONE 2 mg",
                "ZOPICLONE 3 mg",
                "METHYLPHENIDATE (RITALIN) 10 mg",
                "METHYLPHENIDATE (CONCERTA) 18 mg",
                "METHYLPHENIDATE (CONCERTA) 27 mg",
                "METHYLPHENIDATE (CONCERTA) 36 mg",
                "METHYLPHENIDATE (CONCERTA) 54 mg",
                "ATOMOXETINE 18 mg",
                "ATOMOXETINE 25 mg",
                "Other"
];

const SearchComponent: React.FC<SearchComponentProps> = ({
  setSelectedOptions,
  setSelectedDataOutside,
}) => {
  const [modalValues, setModalValues] = useState({
  dose: "",
  frequency: "",
  medication: "",
});

  const [modalVisible, setModalVisible] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOptions, setSelectedOptionsLocal] = useState<string[]>([]);
  const [selectedData, setSelectedData] = useState<
    { medication: string; dose: string; frequency: string }[]
  >([]);

  const [lastSelectedMedication, setLastSelectedMedication] =
    useState<string | null>(null);

  const [searchText, setSearchText] = useState("");
  const [sendOther, setSendOther] = useState(false);

  // Pour l'édition : on stocke l'index en édition (ou null si création)
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    setSelectedDataOutside(selectedData);

    // Sync selectedOptions from selectedData meds
    setSelectedOptionsLocal(selectedData.map((d) => d.medication));
    setSelectedOptions(selectedData.map((d) => d.medication));
  }, [selectedData]);

  // Filter options based on search text (case-insensitive)
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleSelection = (option: string) => {
  if (selectedOptions.includes(option)) {
    // suppression
    const updatedOptions = selectedOptions.filter((item) => item !== option);
    setSelectedOptionsLocal(updatedOptions);
    setSelectedOptions(updatedOptions);
    setSelectedData((prev) => prev.filter((item) => item.medication !== option));
  } else {
    // ajout - on vide les valeurs de la modale
    const updatedOptions = [...selectedOptions, option];
    setSelectedOptionsLocal(updatedOptions);
    setSelectedOptions(updatedOptions);

    setLastSelectedMedication(option);
    setEditIndex(null);
    setSendOther(option === "Other");

    // **Réinitialisation des valeurs à vide pour ajout**
    setModalValues({
      dose: "",
      frequency: "",
      medication: option,
    });

    setModalVisible(true);
  }
  setDropdownOpen(false);
  setSearchText("");
};

  const clearSelection = () => {
    setSelectedOptionsLocal([]);
    setSelectedOptions([]);
    setSelectedData([]);
    setSearchText("");
  };

  const handleSave = (
    doseOrEmpty: string | undefined,
    frequency: string,
    medName?: string
  ) => {
    if (!lastSelectedMedication && !medName) return;

    const medicationName = medName ?? lastSelectedMedication!;

    if (editIndex !== null) {
      // Edition : mettre à jour l'entrée existante
      setSelectedData((prev) => {
        const updated = [...prev];
        updated[editIndex] = { medication: medicationName, dose: doseOrEmpty ?? "", frequency };
        return updated;
      });
    } else {
      // Création : ajouter nouvelle entrée
      setSelectedData((prev) => [
        ...prev,
        { medication: medicationName, dose: doseOrEmpty ?? "", frequency },
      ]);
    }

    setModalVisible(false);
    setEditIndex(null);
  };

  // Ouvre la modale en mode édition avec valeurs pré-remplies
 const onEdit = (index: number) => {
  const item = selectedData[index];
  setLastSelectedMedication(item.medication);
  setEditIndex(index);
  setSendOther(item.medication === "Other");
  setModalValues({
    dose: item.dose,
    frequency: item.frequency,
    medication: item.medication,
  });
  setModalVisible(true);
};

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setDropdownOpen(!isDropdownOpen)}
        activeOpacity={1}
      >
        <Ionicons name="search-outline" size={18} color="purple" style={styles.icon} />

        <TextInput
          style={styles.searchInput}
          placeholder="Select medication..."
          placeholderTextColor="#B766DA"
          value={searchText}
          onChangeText={setSearchText}
          onFocus={() => setDropdownOpen(true)}
          pointerEvents="auto"
        />

        <View style={styles.endButtons}>
          {selectedOptions.length > 0 && (
            <TouchableOpacity onPress={clearSelection} style={styles.button}>
              <Ionicons name="close-circle-outline" size={20} color="purple" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => setDropdownOpen(!isDropdownOpen)}
            style={styles.button}
          >
            <Ionicons name="add-circle-outline" size={20} color="purple" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <View style={styles.selectedContainer}>
        {selectedData.map((item, index) => (
          <View key={index} style={styles.selectedTag}>
            <Text style={styles.selectedText}>
              {item.medication} | {item.dose} | {item.frequency}
            </Text>
            <TouchableOpacity onPress={() => onEdit(index)} style={{ marginRight: 8 }}>
              <Ionicons name="pencil-outline" size={18} color="purple" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleSelection(item.medication)}>
              <Ionicons name="close-outline" size={16} color="purple" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {isDropdownOpen && (
        <View style={styles.dropdownMenu}>
          <ScrollView nestedScrollEnabled style={styles.scrollContainer}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    toggleSelection(option);
                    setSearchText("");
                  }}
                >
                  <Text style={styles.dropdownItemText}>{option}</Text>
                  {selectedOptions.includes(option) && (
                    <Ionicons name="checkmark-outline" size={20} color="purple" />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <Text
                style={[styles.dropdownItemText, { textAlign: "center", paddingVertical: 10 }]}
              >
                No medications found
              </Text>
            )}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setDropdownOpen(false)}
          >
            <Ionicons name="close-circle-outline" size={24} color="purple" />
          </TouchableOpacity>
        </View>
      )}

      <CenteredModal
  isVisible={modalVisible}
  onClose={() => {
    setModalVisible(false);
    setEditIndex(null);
  }}
  onSave={handleSave}
  other={sendOther} // ✅ pass the actual boolean value
  initialDose={modalValues.dose}
  initialFrequency={modalValues.frequency}
  initialMedication={modalValues.medication}
/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2D6FF",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 18,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: "#B766DA",
    width: "90%",
  },
  icon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: "#B766DA",
    paddingVertical: 0,
  },
  endButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
  },
  button: {
    marginLeft: 10,
  },
  dropdownMenu: {
    backgroundColor: "#F2D6FF",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#B766DA",
    paddingVertical: 10,
    width: "90%",
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderWidth: 5,
    borderColor: "#f2d1ff",
  },
  dropdownItemText: {
    color: "#B766DA",
    fontSize: 18,
  },
  selectedContainer: {
    width: "90%",
    marginTop: 10,
  },
  selectedTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0b3ff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 5,
  },
  selectedText: {
    color: "#B766DA",
    marginRight: 5,
    fontSize: 16,
    flexShrink: 1,
  },
  scrollContainer: {
    maxHeight: 200,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
});

export default SearchComponent;
