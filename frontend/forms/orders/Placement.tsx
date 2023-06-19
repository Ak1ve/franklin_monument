import { DndProvider, useDrag, useDrop } from "react-dnd";
import Base, { Section } from "../Base";
import { HTML5Backend, getEmptyImage } from "react-dnd-html5-backend";
import { CSSProperties, FC, memo, useCallback, useState } from "react";
import { InputGrid, StandardTextArea } from "@/components/Inputs";
import { basicCheckbox, basicInput, basicTextArea } from "@/utilities/form";
import { basicSelect } from "@/utilities/form";
import { useImmer } from "use-immer";

function Bar() {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: "bar",
    item: { data: "bar" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  return (
    <div
      ref={drag}
      className="cursor-move bg-black overflow-visible text-white w-[200%] select-none text-center align-middle relative"
    >
      Monument
    </div>
  );
}

function PlacementBin({
  children,
  onDrop,
  showBar,
}: {
  children: any;
  onDrop: () => any;
  showBar: boolean;
}) {
  let isHover = false;
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "bar",
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return <div ref={drop}>{showBar ? children : "​"}</div>;
}

function basicPlacement(id: string, hook: any) {
  return basicTextArea(
    {
      id,
      label: "",
      inputClass: "!p-0 !mb-0 text-center",
      containerClass: "!p-0 !mb-0",
      placeholder: "Enter Text...",
    },
    hook
  );
}

function PlacementArea() {
  // https://codesandbox.io/s/github/react-dnd/react-dnd/tree/gh-pages/examples_ts/01-dustbin/multiple-targets?from-embed=&file=/src/Container.tsx
  const [bins, setBins] = useState({ bar: 0 });

  const placementBins = Array(21)
    .fill(null)
    .map((_, index) => (
      <PlacementBin
        key={index}
        showBar={bins.bar === index}
        onDrop={() => setBins({ bar: index })}
      >
        <Bar />
      </PlacementBin>
    ));
  const placement = useImmer({
    placement1: null,
    placement2: null,
    placement3: null,
    placement4: null,
    placement5: null,
    placement6: null,
    placement7: null,
    placement8: null,
  });

  return (
    <div className="p-3">
      <div className="grid grid-cols-8">
        {placementBins.slice(0, 7)}
        <div />
      </div>
      <InputGrid>
        {basicPlacement("placement1", placement)}
        {basicPlacement("placement2", placement)}
        {basicPlacement("placement3", placement)}
        {basicPlacement("placement4", placement)}
      </InputGrid>
      <div className="grid grid-cols-8">
        {placementBins.slice(7, 14)}
        <div />
      </div>
      <InputGrid>
        {basicPlacement("placement5", placement)}
        {basicPlacement("placement6", placement)}
        {basicPlacement("placement7", placement)}
        {basicPlacement("placement8", placement)}
      </InputGrid>
      <div className="grid grid-cols-8">
        {placementBins.slice(14)}
        <div />
      </div>
    </div>
  );
}

export default function Placement() {
  const place = useImmer({
    standTop: true,
    standBottom: false,
    section: "30",
    lot: "50",
    grave: "133",
    faceStone: "north",
    foundationLength: "50",
    foundationWidth: "50",
    notes: "N/A",
  });

  const options = [
    { label: "Unspecified", value: "unspecified" },
    { label: "North", value: "north" },
    { label: "South", value: "south" },
    { label: "East", value: "east" },
    { label: "West", value: "west" },
  ];
  return (
    <Base sectionHeader="Placement" subheader="Memorial Placement Information">
      <Section className="mt-10">
        <DndProvider backend={HTML5Backend}>
          <PlacementArea />
        </DndProvider>
      </Section>
      <Section className="mt-10 mb-10">
        <h2 className="section-header mb-5">Cemetery Placement</h2>
        <InputGrid>
          {basicInput({ id: "section", label: "Section" }, place)}
          {basicInput({ id: "lot", label: "Lot" }, place)}
        </InputGrid>
        <InputGrid>
          {basicInput({ id: "grave", label: "Grave" }, place)}
          {basicSelect(
            { id: "faceStone", label: "Face Stone", options: options },
            place
          )}
        </InputGrid>
        <InputGrid>
          {basicInput(
            { id: "foundationLength", label: "Foundation Length" },
            place
          )}
          {basicInput(
            { id: "foundationWidth", label: "Foundation Width" },
            place
          )}
        </InputGrid>
        {basicTextArea({ id: "notes", label: "Notes" }, place)}
      </Section>
    </Base>
  );
}
