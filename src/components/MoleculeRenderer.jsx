import React, { useEffect, useRef } from "react";

const MoleculeRenderer = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!data) return;

    const { atoms, bonds, coords } = data.PC_Compounds[0];
    const { conformers } = coords[0];
    const atomPositions = conformers[0];

    // Canvas dimensions
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Extract positions
    const xPositions = atomPositions.x;
    const yPositions = atomPositions.y;

    // Calculate bounding box of the molecule
    const minX = Math.min(...xPositions);
    const maxX = Math.max(...xPositions);
    const minY = Math.min(...yPositions);
    const maxY = Math.max(...yPositions);

    // Molecule width and height
    const moleculeWidth = maxX - minX;
    const moleculeHeight = maxY - minY;

    // Calculate scaling factor to fit molecule within canvas (with padding)
    const padding = 20;
    const scale = Math.min(
      (canvasWidth - padding * 2) / moleculeWidth,
      (canvasHeight - padding * 2) / moleculeHeight
    );

    // Calculate offsets to center the molecule
    const offsetX = (canvasWidth - moleculeWidth * scale) / 2 - minX * scale;
    const offsetY = (canvasHeight - moleculeHeight * scale) / 2 - minY * scale;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Atom radius for visibility
    const atomRadius = 10;

    // Draw atoms
    atoms.aid.forEach((aid, index) => {
      const x = atomPositions.x[index] * scale + offsetX;
      const y = atomPositions.y[index] * scale + offsetY;
      const element = atoms.element[index];

      // Draw atom as a circle
      ctx.beginPath();
      ctx.arc(x, y, atomRadius, 0, 2 * Math.PI); // Fixed radius
      ctx.fillStyle = getAtomColor(element); // Color based on element
      ctx.fill();
      ctx.stroke();

      // Add element symbol with custom text styling for Carbon
      ctx.fillStyle = element === 6 ? "white" : "black"; // White text for Carbon
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.fillText(getElementSymbol(element), x, y + 4); // Center text
    });

    // Draw bonds
    bonds.aid1.forEach((startId, index) => {
      const endId = bonds.aid2[index];
      const order = bonds.order[index];

      // Get start and end atom positions
      const startX = atomPositions.x[startId - 1] * scale + offsetX;
      const startY = atomPositions.y[startId - 1] * scale + offsetY;
      const endX = atomPositions.x[endId - 1] * scale + offsetX;
      const endY = atomPositions.y[endId - 1] * scale + offsetY;

      // Calculate the direction of the bond
      const dx = endX - startX;
      const dy = endY - startY;
      const length = Math.sqrt(dx * dx + dy * dy);

      // Adjust start and end points to avoid overlapping the atom circles
      const startOffsetX = (dx / length) * atomRadius;
      const startOffsetY = (dy / length) * atomRadius;
      const endOffsetX = (dx / length) * -atomRadius;
      const endOffsetY = (dy / length) * -atomRadius;

      // Draw the bond line
      ctx.beginPath();
      ctx.moveTo(startX + startOffsetX, startY + startOffsetY);
      ctx.lineTo(endX + endOffsetX, endY + endOffsetY);
      ctx.lineWidth = order * 2; // Scale bond thickness
      ctx.strokeStyle = "white";
      ctx.stroke();
    });
  }, [data]);

  const getElementSymbol = (atomicNumber) => {
    const periodicTable = [
      "",
      "H",
      "He",
      "Li",
      "Be",
      "B",
      "C",
      "N",
      "O",
      "F",
      "Ne",
      "Na",
      "Mg",
      "Al",
      "Si",
      "P",
      "S",
      "Cl",
      "Ar",
      "K",
      "Ca",
      "Sc",
      "Ti",
      "V",
      "Cr",
      "Mn",
      "Fe",
      "Co",
      "Ni",
      "Cu",
      "Zn",
      "Ga",
      "Ge",
      "As",
      "Se",
      "Br",
      "Kr",
      "Rb",
      "Sr",
      "Y",
      "Zr",
      "Nb",
      "Mo",
      "Tc",
      "Ru",
      "Rh",
      "Pd",
      "Ag",
      "Cd",
      "In",
      "Sn",
      "Sb",
      "Te",
      "I",
      "Xe",
      "Cs",
      "Ba",
      "La",
      "Ce",
      "Pr",
      "Nd",
      "Pm",
      "Sm",
      "Eu",
      "Gd",
      "Tb",
      "Dy",
      "Ho",
      "Er",
      "Tm",
      "Yb",
      "Lu",
      "Hf",
      "Ta",
      "W",
      "Re",
      "Os",
      "Ir",
      "Pt",
      "Au",
      "Hg",
      "Tl",
      "Pb",
      "Bi",
      "Po",
      "At",
      "Rn",
      "Fr",
      "Ra",
      "Ac",
      "Th",
      "Pa",
      "U",
      "Np",
      "Pu",
    ];
    return periodicTable[atomicNumber] || "?";
  };

  const getAtomColor = (atomicNumber) => {
    const colors = {
      1: "#FFFFFF",
      6: "#000000",
      7: "#0000FF",
      8: "#FF0000",
      9: "#FFFF00",
      15: "#FFA500",
      16: "#FFFF00",
      17: "#00FF00",
      35: "#8B4513",
      53: "#800080",
      2: "#D9FFFF",
      10: "#FFC0CB",
      5: "#FFAA33",
      12: "#C0C0C0",
      13: "#A8A8A8",
      14: "#FF4500",
      20: "#808080",
      26: "#FFA500",
      80: "#FFD700",
      78: "#E5E4E2",
      79: "#DAA520",
    };
    return colors[atomicNumber] || "#CCCCCC"; // Default color
  };

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={300}
      style={{ border: "1px solid black", backgroundColor: "red" }}
    />
  );
};

export default MoleculeRenderer;
