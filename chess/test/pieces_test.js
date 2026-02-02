import { describe, it, beforeEach } from "@std/testing/bdd";
import { assertEquals, assertInstanceOf, assertArrayIncludes } from "@std/assert";

import { King, Pawn } from "../src/pieces.js";

describe("Testing pieces", () => {
  describe("King : ", () => {
    describe("white King : ", () => {
      let king;
      beforeEach(() => {
        king = new King("white")
      })

      it("Initializing king", () => {
        assertInstanceOf(king, King)
      })

      it("posible Moves should return all posible moves", () => {
        const posibleMoves = [
          { x: 4, y: 8 },
          { x: 4, y: 6 },
          { x: 5, y: 8 },
          { x: 3, y: 6 },
          { x: 5, y: 6 },
          { x: 3, y: 8 },
          { x: 3, y: 7 },
          { x: 5, y: 7 },
        ]

        assertArrayIncludes(king.possibleMoves(), posibleMoves);
        assertEquals(king.possibleMoves().length, posibleMoves.length)
      })

      it("move should change the position to target position", () => {
        assertEquals(king.position, { x: 4, y: 7 })
        king.move({ x: 5, y: 8 })
        assertEquals(king.position, { x: 5, y: 8 })
      })
    })
    describe("Black King : ", () => {
      let king;
      beforeEach(() => {
        king = new King("black")
      })
      it("Initializing king", () => {
        assertInstanceOf(king, King)
      })

      it("posible Moves should return all posible moves", () => {
        const posibleMoves = [
          { x: 4, y: 1 },
          { x: 4, y: -1 },
          { x: 5, y: 1 },
          { x: 3, y: -1 },
          { x: 5, y: -1 },
          { x: 3, y: 1 },
          { x: 3, y: 0 },
          { x: 5, y: 0 },
        ]

        assertArrayIncludes(king.possibleMoves(), posibleMoves);
        assertEquals(king.possibleMoves().length, posibleMoves.length)
      })

      it("move should change the position to target position", () => {
        assertEquals(king.position, { x: 4, y: 0 })
        king.move({ x: 5, y: 1 })
        assertEquals(king.position, { x: 5, y: 1 })
      })
    })
  })

  describe("Pawn : ", () => {
    describe("White Pawn", () => {
      let pawn;
      beforeEach(() => {
        pawn = new Pawn("white", 0)
      })

      it("Initializing Pawn", () => {
        assertInstanceOf(pawn, Pawn)
        assertEquals(pawn.color, "white")
        assertEquals(pawn.position, { x: 0, y: 6 });
      })

      it("Possible Moves", () => {
        const posibleMoves = [
          { x: 0, y: 5 },
          { x: 0, y: 4 },
          { x: 1, y: 5 },
          { x: -1, y: 5 },
        ]
        assertArrayIncludes(pawn.possibleMoves(), posibleMoves)
        assertEquals(pawn.possibleMoves().length, posibleMoves.length);
      })
      it("move should change the position to target position", () => {
        assertEquals(pawn.position, { x: 0, y: 6 })
        pawn.move({ x: 5, y: 8 })
        assertEquals(pawn.position, { x: 5, y: 8 })
      })
    })

    describe("black Pawn", () => {
      let pawn;
      beforeEach(() => {
        pawn = new Pawn("black", 0)
      })

      it("Initializing Pawn", () => {
        assertInstanceOf(pawn, Pawn)
        assertEquals(pawn.color, "black")
        assertEquals(pawn.position, { x: 0, y: 1 });
      })

      it("Possible Moves", () => {
        const posibleMoves = [
          { x: 0, y: 3 },
          { x: 0, y: 2 },
          { x: 1, y: 2 },
          { x: -1, y: 2 },
        ]
        assertArrayIncludes(pawn.possibleMoves(), posibleMoves)
        assertEquals(pawn.possibleMoves().length, posibleMoves.length);
      })
      it("move should change the position to target position", () => {
        assertEquals(pawn.position, { x: 0, y: 1 })
        pawn.move({ x: 5, y: 8 })
        assertEquals(pawn.position, { x: 5, y: 8 })
      })
    })
  })

})